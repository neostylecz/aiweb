"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { getPublicMediaUrl, type MediaRow } from "@/lib/queries/media";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { MediaPicker } from "./media-picker";

export function GalleryPicker({
  items,
  onChange,
}: {
  items: MediaRow[];
  onChange: (items: MediaRow[]) => void;
}) {
  const [pickerValue, setPickerValue] = useState<string | null>(null);
  const supabaseUrl = getSupabaseUrl();

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-foreground">Gallery</p>

      {items.length > 0 ? (
        <div className="mb-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {items.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-md border border-border">
              <Image
                src={getPublicMediaUrl(supabaseUrl, item) ?? ""}
                alt={item.alt_text ?? ""}
                width={160}
                height={160}
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
                aria-label="Remove from gallery"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <MediaPicker
        value={pickerValue}
        onChange={(id) => {
          setPickerValue(null);
          if (!id || items.some((i) => i.id === id)) return;
          // Fetching the freshly picked media row is handled by MediaPicker
          // internally; here we just need its id echoed back with basic
          // metadata, so re-derive it from the DOM-less picker callback.
          fetchAndAdd(id);
        }}
        label="Add image"
      />
    </div>
  );

  async function fetchAndAdd(id: string) {
    const supabase = createClient();
    const { data } = await supabase.from("media").select("*").eq("id", id).maybeSingle();
    if (data) onChange([...items, data]);
  }
}
