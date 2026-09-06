"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { galleryItemSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function updateGalleryItem(id: string, formData: FormData) {
  const supabase = await createClient();
  const raw = {
    category_id: formData.get("category_id") || null,
    title: formData.get("title"),
    alt_text: formData.get("alt_text"),
    caption: formData.get("caption"),
    is_published: formData.get("is_published") === "true",
    is_featured: formData.get("is_featured") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const parsed = galleryItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };
  }

  const { error } = await supabase
    .from("gallery")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteGalleryItem(id: string, publicId: string) {
  const supabase = await createClient();

  // Delete from Cloudinary first to avoid orphaned files
  try {
    await deleteFromCloudinary(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    // Still proceed to remove DB row
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function togglePublished(id: string, currentValue: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery")
    .update({ is_published: !currentValue })
    .eq("id", id);

  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function saveGalleryItemAfterUpload(data: {
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery").insert({
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    alt_text: "",
    is_published: false,
    is_featured: false,
    sort_order: 0,
  });

  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/gallery");
  return { success: true };
}
