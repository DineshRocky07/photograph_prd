import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { public_id, width, height, format, bytes } = body;

  if (!public_id) return NextResponse.json({ error: "public_id required" }, { status: 400 });

  const { error } = await supabase.from("gallery").insert({
    public_id,
    width: width ?? null,
    height: height ?? null,
    format: format ?? null,
    bytes: bytes ?? null,
    alt_text: "",
    is_published: true,  // auto-publish by default
    is_featured: false,
    sort_order: 0,
  });

  if (error) {
    // Duplicate upload — already saved, not an error
    if (error.code === "23505") return NextResponse.json({ success: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
