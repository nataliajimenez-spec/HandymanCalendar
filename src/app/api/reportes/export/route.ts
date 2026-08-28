import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getReportData, reportToCsv } from "@/lib/reports";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  const now = new Date();
  const start = startParam
    ? new Date(`${startParam}T00:00:00`)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = endParam ? new Date(`${endParam}T23:59:59.999`) : now;

  const { properties } = await getReportData(start, end);
  const csv = reportToCsv(properties);
  const bom = "﻿"; // para que Excel reconozca acentos correctamente

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reporte-${startParam ?? "inicio"}-a-${endParam ?? "hoy"}.csv"`,
    },
  });
}
