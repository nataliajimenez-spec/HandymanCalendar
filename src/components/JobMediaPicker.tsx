"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type PendingMedia = { url: string; type: "PHOTO" | "VIDEO"; fileName: string };

/**
 * Selector de fotos/video para un trabajo que todavía no existe en la base de
 * datos (se usa al agendar). Sube directo a Vercel Blob y guarda la lista en
 * un input oculto como JSON; el server action las asocia al trabajo una vez
 * creado (ver `parseMediaField` en trabajos/actions.ts).
 */
export function JobMediaPicker({
  fieldName,
  label,
  accept = "image/*",
}: {
  fieldName: string;
  label: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PendingMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      const uploaded: PendingMedia[] = [];
      for (const file of fileArray) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        uploaded.push({
          url: blob.url,
          type: file.type.startsWith("video") ? "VIDEO" : "PHOTO",
          fileName: file.name,
        });
      }
      setItems((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError((e as Error).message || "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    setItems((prev) => prev.filter((i) => i.url !== url));
  }

  return (
    <div className="space-y-1">
      <input type="hidden" name={fieldName} value={JSON.stringify(items)} />
      <label className="field-label">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="input-field-sm w-full"
      />
      {uploading && <div className="text-xs text-gray-500">Subiendo...</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {items.map((m) => (
            <div key={m.url} className="relative border rounded overflow-hidden bg-black/5">
              {m.type === "PHOTO" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.fileName} className="w-full h-16 object-cover" />
              ) : (
                <video src={m.url} className="w-full h-16 object-cover" />
              )}
              <button
                type="button"
                onClick={() => remove(m.url)}
                className="absolute top-0.5 right-0.5 rounded bg-black/60 px-1 text-[10px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
