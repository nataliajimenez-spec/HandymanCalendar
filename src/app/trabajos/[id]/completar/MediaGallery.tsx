"use client";

import { useTransition } from "react";
import { removeMedia } from "./actions";

type Media = {
  id: string;
  type: "PHOTO" | "VIDEO";
  url: string;
  fileName: string | null;
};

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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {media.map((m) => (
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
