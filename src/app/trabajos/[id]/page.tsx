import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { JobEditForm } from "./JobEditForm";
import { CancelJobForm } from "./CancelJobForm";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      property: true,
      unit: true,
      createdBy: true,
      cancelledBy: true,
    },
  });

  if (!job) notFound();

  const properties = await prisma.property.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: { units: { where: { active: true }, orderBy: { label: "asc" } } },
  });

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">{job.title}</h1>
          <p className="text-sm text-gray-500">
            {job.property.name}
            {job.unit && ` / ${job.unit.label}`} ·{" "}
            {format(job.scheduledAt, "d 'de' MMMM yyyy, h:mm a")}
          </p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      {job.description && <p className="text-sm text-gray-700">{job.description}</p>}

      <div className="text-xs text-gray-500 space-y-0.5">
        <div>
          Agendado por <span className="font-medium">{job.createdBy.name}</span> el{" "}
          {format(job.createdAt, "d/M/yyyy h:mm a")}
        </div>
        {job.status === "CANCELLED" && (
          <div>
            Cancelado por <span className="font-medium">{job.cancelledBy?.name}</span> el{" "}
            {job.cancelledAt && format(job.cancelledAt, "d/M/yyyy h:mm a")}
            {job.cancelReason && ` — "${job.cancelReason}"`}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {job.status === "SCHEDULED" && (
          <Link
            href={`/trabajos/${job.id}/completar`}
            className="text-sm bg-green-600 text-white rounded px-3 py-1.5 font-medium"
          >
            Completar trabajo
          </Link>
        )}
        {job.status === "COMPLETED" && (
          <Link
            href={`/trabajos/${job.id}/completar`}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50"
          >
            Ver detalles de finalización
          </Link>
        )}
        <CancelJobForm jobId={job.id} status={job.status} />
      </div>

      {job.status === "SCHEDULED" && (
        <JobEditForm
          jobId={job.id}
          properties={properties}
          title={job.title}
          description={job.description}
          scheduledAtLocal={format(job.scheduledAt, "yyyy-MM-dd'T'HH:mm")}
          propertyId={job.propertyId}
          unitId={job.unitId}
        />
      )}
    </div>
  );
}
