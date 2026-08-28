import { prisma } from "@/lib/prisma";

export type ReportJob = {
  id: string;
  title: string;
  completedAt: Date;
  createdByName: string;
  laborCost: number;
  materialCost: number;
  total: number;
};

export type ReportUnitGroup = {
  unitId: string | null;
  unitLabel: string;
  jobs: ReportJob[];
  subtotal: number;
};

export type ReportPropertyGroup = {
  propertyId: string;
  propertyName: string;
  units: ReportUnitGroup[];
  subtotal: number;
};

export async function getReportData(start: Date, end: Date) {
  const jobs = await prisma.job.findMany({
    where: {
      status: "COMPLETED",
      completedAt: { gte: start, lte: end },
    },
    include: {
      property: true,
      unit: true,
      createdBy: true,
      lineItems: true,
    },
    orderBy: [{ property: { name: "asc" } }, { completedAt: "asc" }],
  });

  const propertyMap = new Map<string, ReportPropertyGroup>();

  for (const job of jobs) {
    const laborCost = job.lineItems
      .filter((i) => i.type === "LABOR")
      .reduce((sum, i) => sum + Number(i.quantity) * Number(i.unitPrice), 0);
    const materialCost = job.lineItems
      .filter((i) => i.type === "MATERIAL")
      .reduce((sum, i) => sum + Number(i.quantity) * Number(i.unitPrice), 0);
    const total = laborCost + materialCost;

    if (!propertyMap.has(job.propertyId)) {
      propertyMap.set(job.propertyId, {
        propertyId: job.propertyId,
        propertyName: job.property.name,
        units: [],
        subtotal: 0,
      });
    }
    const propertyGroup = propertyMap.get(job.propertyId)!;

    const unitId = job.unitId;
    const unitLabel = job.unit?.label ?? "Toda la propiedad (sin unidad específica)";
    let unitGroup = propertyGroup.units.find((u) => u.unitId === unitId);
    if (!unitGroup) {
      unitGroup = { unitId, unitLabel, jobs: [], subtotal: 0 };
      propertyGroup.units.push(unitGroup);
    }

    unitGroup.jobs.push({
      id: job.id,
      title: job.title,
      completedAt: job.completedAt as Date,
      createdByName: job.createdBy.name,
      laborCost,
      materialCost,
      total,
    });
    unitGroup.subtotal += total;
    propertyGroup.subtotal += total;
  }

  const properties = Array.from(propertyMap.values());
  const grandTotal = properties.reduce((sum, p) => sum + p.subtotal, 0);

  return { properties, grandTotal, jobCount: jobs.length };
}

export function reportToCsv(properties: ReportPropertyGroup[]) {
  const header = [
    "Propiedad",
    "Unidad",
    "Trabajo",
    "Fecha completado",
    "Agendado/hecho por",
    "Mano de obra",
    "Materiales",
    "Total",
  ];

  const rows: string[][] = [header];

  for (const property of properties) {
    for (const unit of property.units) {
      for (const job of unit.jobs) {
        rows.push([
          property.propertyName,
          unit.unitLabel,
          job.title,
          job.completedAt.toISOString().slice(0, 10),
          job.createdByName,
          job.laborCost.toFixed(2),
          job.materialCost.toFixed(2),
          job.total.toFixed(2),
        ]);
      }
    }
  }

  const escape = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  return rows.map((row) => row.map(escape).join(",")).join("\n");
}
