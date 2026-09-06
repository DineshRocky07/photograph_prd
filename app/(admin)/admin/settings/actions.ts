"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteSettingsSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";

export async function saveSettings(formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    raw[key] = value === "" ? undefined : value;
  }

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return { success: false, error: firstError ?? "Validation failed" };
  }

  const supabase = await createClient();

  // Check if a settings row exists
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .single();

  let dbError;
  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update(parsed.data)
      .eq("id", existing.id);
    dbError = error;
  } else {
    const { error } = await supabase.from("site_settings").insert(parsed.data);
    dbError = error;
  }

  if (dbError) return { success: false, error: getErrorMessage(dbError) };

  // Revalidate every public page and root layout that reads from site_settings
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");

  return { success: true };
}
