"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { inquiryStatusSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function updateInquiryStatus(id: string, status: string) {
  const parsed = inquiryStatusSchema.safeParse({ id, status });
  if (!parsed.success) return { success: false, error: "Invalid status" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status })
    .eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function archiveInquiry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ is_archived: true })
    .eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function deleteInquiry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return { success: false, error: getErrorMessage(error) };

  revalidatePath("/admin/inquiries");
  return { success: true };
}
