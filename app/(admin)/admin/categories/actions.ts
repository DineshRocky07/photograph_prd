"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function createCategory(formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}
