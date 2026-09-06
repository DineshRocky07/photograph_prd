"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { optimizeImageForUpload } from "@/lib/image-compress";

type UploadItem = {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMsg?: string;
};

export function GalleryUploader() {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newItems: UploadItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending",
      }));
    setItems((prev) => [...prev, ...newItems]);
  }

  async function uploadAll() {
    let anyDone = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].status !== "pending") continue;

      // Mark as uploading
      setItems((prev) =>
        prev.map((u, idx) => (idx === i ? { ...u, status: "uploading" } : u))
      );

      try {
        // Optimize image in browser if it's large (prevents Vercel 4.5MB limit error)
        const fileToUpload = await optimizeImageForUpload(items[i].file);

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("folder", "balaphoto/gallery");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();

        if (!res.ok || json.error) {
          setItems((prev) =>
            prev.map((u, idx) =>
              idx === i ? { ...u, status: "error", errorMsg: json.error ?? "Upload failed" } : u
            )
          );
          continue;
        }

        // Save to Supabase DB — auto-published by default
        const saveRes = await fetch("/api/admin/save-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });
        const saveJson = await saveRes.json();

        if (!saveRes.ok && saveJson.error !== undefined) {
          // Cloudinary upload worked but DB save failed
          setItems((prev) =>
            prev.map((u, idx) =>
              idx === i
                ? {
                    ...u,
                    status: "error",
                    errorMsg: `Saved to Cloudinary but database failed: ${saveJson.error}`,
                  }
                : u
            )
          );
          continue;
        }

        setItems((prev) =>
          prev.map((u, idx) => (idx === i ? { ...u, status: "done" } : u))
        );
        anyDone = true;
      } catch (err) {
        setItems((prev) =>
          prev.map((u, idx) =>
            idx === i
              ? { ...u, status: "error", errorMsg: err instanceof Error ? err.message : "Network error" }
              : u
          )
        );
      }
    }

    // Refresh the gallery list automatically
    if (anyDone) {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  const pendingCount = items.filter((u) => u.status === "pending").length;
  const doneCount = items.filter((u) => u.status === "done").length;
  const errorCount = items.filter((u) => u.status === "error").length;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors select-none ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary hover:bg-muted/20"
        }`}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">Click to browse or drag images here</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — max 10 MB each · Photos publish automatically</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Upload queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          {/* Summary feedback */}
          {doneCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              {doneCount} photo{doneCount !== 1 ? "s" : ""} uploaded and live on your website!
            </div>
          )}
          {errorCount > 0 && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorCount} photo{errorCount !== 1 ? "s" : ""} failed. Check file size (max 10 MB) and try again.
            </div>
          )}

          {/* Thumbnail grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {items.map((u, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                <Image src={u.preview} alt="Preview" fill sizes="(max-width: 640px) 33vw, 14vw" className="object-cover" />
                {/* Status overlay */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${u.status === "pending" ? "" : "bg-black/50"}`}>
                  {u.status === "uploading" && <Loader2 className="h-5 w-5 text-white animate-spin" />}
                  {u.status === "done" && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {u.status === "error" && (
                    <div className="text-center p-1">
                      <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      <p className="text-white text-[10px] mt-1 leading-tight">{u.errorMsg}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <Button onClick={uploadAll} disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
                ) : (
                  `Upload ${pendingCount} photo${pendingCount !== 1 ? "s" : ""}`
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setItems([])}
              disabled={isPending}
            >
              Clear list
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
