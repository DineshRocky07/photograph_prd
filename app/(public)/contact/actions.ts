"use server";

import { createClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validations";

export type ContactActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInquiry(
  prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, subject, message } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
    status: "new",
  });

  if (error) {
    console.error("Inquiry insert error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: true };
}
