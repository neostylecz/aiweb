"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPublicMediaUrl, type MediaRow } from "@/lib/queries/media";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { uploadMediaFile } from "@/lib/media/upload";
import { cn } from "@/lib/utils";

export function MediaPicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseUrl = getSupabaseUrl();

  const selected = media.find((m) => m.id === value) ?? null;

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kick off library fetch when the modal opens
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMedia(data ?? []);
        setLoading(false);
      });
  }, [open]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();

    for (const file of Array.from(files)) {
      const { media: inserted, error: uploadError } = await uploadMediaFile(supabase, file);
      if (uploadError) {
        setError(uploadError);
        continue;
      }
      if (inserted) {
        setMedia((prev) => [inserted, ...prev]);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-foreground">{label}</p>

      <div className="flex items-center gap-3">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {selected ? (
            <Image
              src={getPublicMediaUrl(supabaseUrl, selected) ?? ""}
              alt={selected.alt_text ?? ""}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          ) : (
            <ImageOff className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Choose image
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-background p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Media library</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                Upload
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
              {error ? <p className="text-xs text-red-500">{error}</p> : null}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 overflow-y-auto sm:grid-cols-6">
              {loading ? (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  Loading…
                </p>
              ) : media.length === 0 ? (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  No media uploaded yet.
                </p>
              ) : (
                media.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "aspect-square overflow-hidden rounded-md border-2",
                      value === item.id ? "border-accent" : "border-transparent hover:border-border",
                    )}
                  >
                    <Image
                      src={getPublicMediaUrl(supabaseUrl, item) ?? ""}
                      alt={item.alt_text ?? ""}
                      width={160}
                      height={160}
                      className="size-full object-cover"
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
