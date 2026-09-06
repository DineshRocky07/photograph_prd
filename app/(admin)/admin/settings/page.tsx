import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";
import type { SiteSettings } from "@/types";

export const metadata: Metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  const settings = data as SiteSettings | null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Site Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Changes here update the public site immediately.
      </p>
      <SettingsClient settings={settings} />
    </div>
  );
}
