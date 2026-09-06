"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Pencil, Trash2, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { updateGalleryItem, deleteGalleryItem, togglePublished } from "./actions";
import type { GalleryItem, Category } from "@/types";

type Props = {
  items: GalleryItem[];
  categories: Category[];
};

export function GalleryManager({ items, categories }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Local edit form state
  const [editForm, setEditForm] = useState<{
    title: string;
    alt_text: string;
    caption: string;
    category_id: string;
    is_featured: boolean;
  }>({ title: "", alt_text: "", caption: "", category_id: "", is_featured: false });

  function startEdit(item: GalleryItem) {
    setEditForm({
      title: item.title ?? "",
      alt_text: item.alt_text,
      caption: item.caption ?? "",
      category_id: item.category_id ?? "",
      is_featured: item.is_featured,
    });
    setEditingId(item.id);
  }

  function handleTogglePublish(item: GalleryItem) {
    setGlobalError(null);
    startTransition(async () => {
      const result = await togglePublished(item.id, item.is_published);
      if (!result.success) setGlobalError(result.error ?? "Could not update — please try again.");
    });
  }

  function handleDelete(item: GalleryItem) {
    if (!confirm(`Are you sure you want to delete this photo? It will be permanently removed from your website and Cloudinary.`)) return;
    setGlobalError(null);
    startTransition(async () => {
      const result = await deleteGalleryItem(item.id, item.public_id);
      if (!result.success) setGlobalError(result.error ?? "Could not delete — please try again.");
    });
  }

  function handleSaveEdit(item: GalleryItem) {
    const fd = new FormData();
    fd.set("title", editForm.title);
    fd.set("alt_text", editForm.alt_text);
    fd.set("caption", editForm.caption);
    fd.set("category_id", editForm.category_id);
    fd.set("is_published", String(item.is_published));
    fd.set("is_featured", String(editForm.is_featured));
    fd.set("sort_order", String(item.sort_order));

    startTransition(async () => {
      const result = await updateGalleryItem(item.id, fd);
      if (result.success) {
        setEditingId(null);
      } else {
        setGlobalError(result.error ?? "Could not save — please try again.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
        <p className="font-medium">No photos yet</p>
        <p className="text-sm mt-1">Upload some photos using the section above.</p>
      </div>
    );
  }

  return (
    <div>
      {globalError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-start justify-between gap-2">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="shrink-0 underline text-xs">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-card overflow-hidden flex flex-col">
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <Image
                src={getCloudinaryUrl(item.public_id, { width: 400, height: 225, crop: "fill", format: "auto", quality: "auto" })}
                alt={item.alt_text || item.title || "Gallery photo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Card body */}
            <div className="flex-1 p-3 space-y-3">
              {editingId === item.id ? (
                /* ── Inline Edit Form ── */
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="h-7 text-xs" placeholder="e.g. Sunset Wedding Portrait" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Alt text (for accessibility)</Label>
                    <Input value={editForm.alt_text} onChange={(e) => setEditForm((f) => ({ ...f, alt_text: e.target.value }))} className="h-7 text-xs" placeholder="Describe the image briefly" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Category</Label>
                    <Select value={editForm.category_id} onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))} className="h-7 text-xs">
                      <option value="">— No category —</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                  </div>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={editForm.is_featured} onChange={(e) => setEditForm((f) => ({ ...f, is_featured: e.target.checked }))} />
                    Show on homepage (featured)
                  </label>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" disabled={isPending} onClick={() => handleSaveEdit(item)}>
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3 mr-1" />Save</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="h-3 w-3 mr-1" />Cancel</Button>
                  </div>
                </div>
              ) : (
                /* ── Display view ── */
                <div className="space-y-2">
                  <p className="text-sm font-medium truncate">{item.title || <span className="text-muted-foreground italic">Untitled</span>}</p>
                  {item.category && <p className="text-xs text-muted-foreground">{item.category.name}</p>}

                  {/* Status + Actions — always visible */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Published/Draft badge */}
                    <button
                      onClick={() => handleTogglePublish(item)}
                      disabled={isPending}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors ${
                        item.is_published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {item.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {item.is_published ? "Live" : "Draft"}
                    </button>

                    <div className="flex gap-1 ml-auto">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item)} title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
