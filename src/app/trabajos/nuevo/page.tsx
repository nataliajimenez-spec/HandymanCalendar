import { prisma } from "@/lib/prisma";
import { JobForm } from "./JobForm";

export const dynamic = "force-dynamic";

export default async function NuevoTrabajoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const properties = await prisma.property.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { units: { where: { active: true }, orderBy: { label: "asc" } } },
  });

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold">Nuevo trabajo</h1>
      <JobForm properties={properties} defaultDate={date} />
    </div>
  );
}
