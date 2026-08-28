"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { addMedia } from "./actions";

export function MediaUploader({ jobId }: { jobId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const fileArray = Array.from(files);
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProgress(`Subiendo ${i + 1} de ${fileArray.length}...`);
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        const type = file.type.startsWith("video") ? "VIDEO" : "PHOTO";
        await addMedia(jobId, { url: blob.url, type, fileName: file.name });
      }
    } catch (e) {
      setError((e as Error).message || "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="block w-full text-sm border rounded px-2 py-2"
      />
      {progress && <div className="text-xs text-gray-500">{progress}</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
