"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function createTestimonial(formData: FormData) {
  const parsed = testimonialSchema.safeParse({
    client_name: formData.get("client_name"),
    client_title: formData.get("client_title"),
    quote: formData.get("quote"),
    rating: formData.get("rating") ? parseInt(formData.get("rating") as string) : null,
    avatar_url: formData.get("avatar_url"),
    is_published: formData.get("is_published") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(parsed.data);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const parsed = testimonialSchema.safeParse({
    client_name: formData.get("client_name"),
    client_title: formData.get("client_title"),
    quote: formData.get("quote"),
    rating: formData.get("rating") ? parseInt(formData.get("rating") as string) : null,
    avatar_url: formData.get("avatar_url"),
    is_published: formData.get("is_published") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });
  if (!parsed.success)
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") };

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTestimonialPublished(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ is_published: !current })
    .eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}
