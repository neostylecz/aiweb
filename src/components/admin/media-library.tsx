"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMediaFile } from "@/lib/media/upload";
import { MediaItem } from "./media-item";
import type { MediaRow } from "@/lib/queries/media";

export function MediaLibrary({ initialMedia }: { initialMedia: MediaRow[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const { media: inserted, error: uploadError } = await uploadMediaFile(supabase, file);
      if (uploadError) setError(uploadError);
      if (inserted) setMedia((prev) => [inserted, ...prev]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload images
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {media.map((item) => (
          <MediaItem
            key={item.id}
            media={item}
            onDeleted={() => setMedia((prev) => prev.filter((m) => m.id !== item.id))}
          />
        ))}
        {media.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No media uploaded yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
