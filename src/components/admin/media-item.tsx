"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateMediaAltText, deleteMedia } from "@/app/actions/media";
import { idleState } from "@/lib/actions/types";
import { Input } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { getPublicMediaUrl, type MediaRow } from "@/lib/queries/media";
import { getSupabaseUrl } from "@/lib/supabase/env";

export function MediaItem({ media, onDeleted }: { media: MediaRow; onDeleted: () => void }) {
  const [state, formAction] = useActionState(updateMediaAltText.bind(null, media.id), idleState);
  const url = getPublicMediaUrl(getSupabaseUrl(), media);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="aspect-square bg-muted">
        {url ? (
          <Image src={url} alt={media.alt_text ?? ""} width={300} height={300} className="size-full object-cover" />
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <p className="truncate text-xs text-muted-foreground" title={media.file_name}>
          {media.file_name}
        </p>
        <form action={formAction} className="flex items-center gap-2">
          <Input
            name="alt_text"
            defaultValue={media.alt_text ?? ""}
            placeholder="Alt text"
            className="h-8 text-xs"
          />
          <SaveButton className="h-8 px-3 text-xs">Save</SaveButton>
        </form>
        {state.status === "success" ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Saved</p>
        ) : null}
        <div className="flex justify-end">
          <DeleteButton
            action={async () => {
              await deleteMedia(media.id);
              onDeleted();
            }}
          />
        </div>
      </div>
    </div>
  );
}
