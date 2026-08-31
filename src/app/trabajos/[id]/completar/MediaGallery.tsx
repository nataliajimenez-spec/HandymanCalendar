"use client";

import { useTransition } from "react";
import { removeMedia } from "./actions";

type Media = {
  id: string;
  type: "PHOTO" | "VIDEO";
  phase: "BEFORE" | "AFTER" | "OTHER";
  url: string;
  fileName: string | null;
};

const GROUPS: { phase: Media["phase"]; label: string }[] = [
  { phase: "BEFORE", label: "Antes" },
  { phase: "AFTER", label: "Después" },
  { phase: "OTHER", label: "Otros" },
];

function MediaGrid({
  jobId,
  items,
  editable,
  isPending,
  startTransition,
}: {
  jobId: string;
  items: Media[];
  editable: boolean;
  isPending: boolean;
  startTransition: (fn: () => Promise<void> | void) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((m) => (
        <div key={m.id} className="relative border rounded overflow-hidden bg-black/5">
          {m.type === "PHOTO" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.url} alt={m.fileName ?? "foto del trabajo"} className="w-full h-28 object-cover" />
          ) : (
            <video src={m.url} controls className="w-full h-28 object-cover" />
          )}
          {editable && (
            <button
              disabled={isPending}
              onClick={() => startTransition(async () => { await removeMedia(jobId, m.id); })}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5 disabled:opacity-50"
            >
              Quitar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function MediaGallery({
  jobId,
  media,
  editable,
}: {
  jobId: string;
  media: Media[];
  editable: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (media.length === 0) {
    return <div className="text-sm text-gray-500">Sin fotos ni video todavía.</div>;
  }

  return (
    <div className="space-y-4">
      {GROUPS.map(({ phase, label }) => {
        const items = media.filter((m) => m.phase === phase);
        if (items.length === 0) return null;
        return (
          <div key={phase} className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</h3>
            <MediaGrid
              jobId={jobId}
              items={items}
              editable={editable}
              isPending={isPending}
              startTransition={startTransition}
            />
          </div>
        );
      })}
    </div>
  );
}
