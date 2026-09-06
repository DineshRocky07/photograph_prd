"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Images, X, Check, Loader2 } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/types";

type Props = {
  /** current selected public_id */
  value: string;
  onChange: (publicId: string) => void;
  /** label shown above the picker */
  label: string;
  /** folder to upload new images to */
  uploadFolder?: string;
};

/**
 * Reusable image picker used in admin Settings.
 * Shows a preview of the current image, an "Upload New" button,
 * and a "Choose Existing" modal with the full gallery.
 */
export function ImagePicker({ value, onChange, label, uploadFolder = "balaphoto" }: Props) {
  const [mode, setMode] = useState<"idle" | "gallery" | "uploading">("idle");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = value
    ? getCloudinaryUrl(value, { width: 300, height: 200, crop: "fill", format: "auto", quality: "auto" })
    : null;

  async function fetchGallery() {
    setLoadingGallery(true);
    try {
      const res = await fetch("/api/admin/gallery-list");
      const data = await res.json();
      setGalleryItems(data.items ?? []);
    } catch {
      setGalleryItems([]);
    } finally {
      setLoadingGallery(false);
    }
  }

  function openGallery() {
    setMode("gallery");
    fetchGallery();
  }

  async function handleFileUpload(file: File) {
    setUploadError(null);
    setMode("uploading");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok || json.error) {
      setUploadError(json.error ?? "Upload failed. Please try again.");
      setMode("idle");
      return;
    }

    // Save to gallery table
    await fetch("/api/admin/save-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    onChange(json.public_id);
    setMode("idle");
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      {/* Preview */}
      {previewUrl ? (
        <div className="relative w-40 h-28 rounded-lg overflow-hidden border group">
          <Image src={previewUrl} alt={label} fill sizes="160px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 rounded-full bg-black/70 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      ) : (
        <div className="w-40 h-28 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs">
          No image
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={mode === "uploading"}
          onClick={() => inputRef.current?.click()}
        >
          {mode === "uploading" ? (
            <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Uploading…</>
          ) : (
            <><Upload className="h-3 w-3 mr-1" />Upload New</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={mode === "uploading"}
          onClick={openGallery}
        >
          <Images className="h-3 w-3 mr-1" />Choose Existing
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="hidden"
        value={value}
        readOnly
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef as React.RefObject<HTMLInputElement>}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* Gallery picker modal */}
      {mode === "gallery" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-xl border shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <p className="font-semibold">Choose an image</p>
              <button type="button" onClick={() => setMode("idle")}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingGallery ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No images uploaded yet. Use &ldquo;Upload New&rdquo; to add one.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {galleryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { onChange(item.public_id); setMode("idle"); }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                        value === item.public_id ? "border-primary ring-2 ring-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={getCloudinaryUrl(item.public_id, { width: 200, height: 200, crop: "fill", format: "auto", quality: "auto" })}
                        alt={item.alt_text || "Gallery image"}
                        fill
                        sizes="(max-width: 640px) 33vw, 25vw"
                        className="object-cover"
                      />
                      {value === item.public_id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
