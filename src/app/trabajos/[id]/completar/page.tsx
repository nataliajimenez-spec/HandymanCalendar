import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canSeePricing } from "@/lib/session";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { LineItemForm } from "./LineItemForm";
import { LineItemList } from "./LineItemList";
import { MediaUploader } from "./MediaUploader";
import { MediaGallery } from "./MediaGallery";
import { CompleteForm } from "./CompleteForm";

export const dynamic = "force-dynamic";

export default async function CompletarTrabajoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const pricesVisible = canSeePricing(user?.role);

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      property: true,
      unit: true,
      lineItems: { include: { createdBy: true }, orderBy: { createdAt: "asc" } },
      media: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!job) notFound();

  const catalogItems = await prisma.priceCatalogItem.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const editable = job.status !== "CANCELLED";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href={`/trabajos/${job.id}`} className="text-sm text-orange-600 hover:underline">
          ← Volver al trabajo
        </Link>
        <div className="flex items-center justify-between gap-2 mt-1">
          <h1 className="text-xl font-semibold">{job.title}</h1>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="text-sm text-gray-500">
          {job.property.name}
          {job.unit && ` / ${job.unit.label}`}
        </p>
      </div>

      {!editable && (
        <div className="text-sm text-gray-600 bg-gray-100 border rounded px-3 py-2">
          Este trabajo está cancelado y no se puede completar.
        </div>
      )}

      <section className="space-y-2">
        <h2 className="font-medium">Tiempo y materiales</h2>
        {pricesVisible && (
          <p className="text-xs text-gray-500">
            Los precios se sugieren del catálogo, pero puedes ajustarlos para este trabajo.
          </p>
        )}
        {editable && (
          <LineItemForm
            jobId={job.id}
            pricesVisible={pricesVisible}
            catalogItems={catalogItems.map((c) => ({
              id: c.id,
              type: c.type,
              name: c.name,
              unitLabel: c.unitLabel,
              unitPrice: pricesVisible ? Number(c.unitPrice) : null,
            }))}
          />
        )}
        <LineItemList
          jobId={job.id}
          editable={editable}
          pricesVisible={pricesVisible}
          items={job.lineItems.map((i) => ({
            id: i.id,
            type: i.type,
            description: i.description,
            quantity: Number(i.quantity),
            unitPrice: pricesVisible ? Number(i.unitPrice) : null,
            note: i.note,
            createdByName: i.createdBy.name,
          }))}
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Fotos y video</h2>
        {editable && <MediaUploader jobId={job.id} />}
        <MediaGallery
          jobId={job.id}
          editable={editable}
          media={job.media.map((m) => ({ id: m.id, type: m.type, url: m.url, fileName: m.fileName }))}
        />
      </section>

      {editable && (
        <section className="space-y-2 border-t pt-4">
          <h2 className="font-medium">
            {job.status === "COMPLETED" ? "Notas del trabajo" : "Finalizar"}
          </h2>
          <CompleteForm jobId={job.id} defaultNotes={job.completionNotes} />
        </section>
      )}
    </div>
  );
}
