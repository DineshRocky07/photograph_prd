import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { InquiriesClient } from "./inquiries-client";
import type { Inquiry, InquiryStatus } from "@/types";

export const metadata: Metadata = { title: "Inquiries | Admin" };

type Props = { searchParams: Promise<{ status?: string; archived?: string }> };

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const { status, archived } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (archived === "true") {
    query = query.eq("is_archived", true);
  } else {
    query = query.eq("is_archived", false);
  }

  if (status && status !== "all") {
    query = query.eq("status", status as InquiryStatus);
  }

  const { data } = await query;
  const inquiries = (data as Inquiry[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>
      <InquiriesClient
        inquiries={inquiries}
        currentStatus={status ?? "all"}
        showArchived={archived === "true"}
      />
    </div>
  );
}
