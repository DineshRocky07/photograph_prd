"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function createService(formData: FormData) {
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price_hint: formData.get("price_hint"),
    category_id: formData.get("category_id") || null,
    cover_public_id: formData.get("cover_public_id"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(parsed.data);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price_hint: formData.get("price_hint"),
    category_id: formData.get("category_id") || null,
    cover_public_id: formData.get("cover_public_id"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("services").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}
