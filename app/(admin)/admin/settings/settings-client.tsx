"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/admin/image-picker";
import { saveSettings } from "./actions";
import type { SiteSettings } from "@/types";

type Props = { settings: SiteSettings | null };

export function SettingsClient({ settings: initial }: Props) {
  const s = initial;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Image fields managed as state so ImagePicker can update them
  const [logoId, setLogoId] = useState(s?.logo_public_id ?? "");
  const [heroId, setHeroId] = useState(s?.hero_image_public_id ?? "");
  const [aboutId, setAboutId] = useState(s?.about_image_public_id ?? "");
  const [ogId, setOgId] = useState(s?.og_image_public_id ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    const formData = new FormData(e.currentTarget);

    // Inject image public_ids from state (not from hidden inputs to avoid confusion)
    formData.set("logo_public_id", logoId);
    formData.set("hero_image_public_id", heroId);
    formData.set("about_image_public_id", aboutId);
    formData.set("og_image_public_id", ogId);

    startTransition(async () => {
      const result = await saveSettings(formData);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 5000);
      } else {
        setError(result.error ?? "Could not save settings. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      {/* ── Feedback banners ── */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Settings saved — the public website has been updated instantly.</span>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <strong>Could not save:</strong> {error}
        </div>
      )}

      {/* ── Business Identity ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">Business Identity</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input id="business_name" name="business_name" defaultValue={s?.business_name ?? ""} required disabled={isPending} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" defaultValue={s?.tagline ?? ""} placeholder="Capturing moments that last forever" disabled={isPending} />
          </div>
        </div>

        <ImagePicker
          label="Business Logo"
          value={logoId}
          onChange={setLogoId}
          uploadFolder="balaphoto/branding"
        />
      </section>

      {/* ── Contact Information ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact_email">Email</Label>
            <Input id="contact_email" name="contact_email" type="email" defaultValue={s?.contact_email ?? ""} placeholder="hello@yourstudio.com" disabled={isPending} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_phone">Phone</Label>
            <Input id="contact_phone" name="contact_phone" defaultValue={s?.contact_phone ?? ""} placeholder="+1 555 000 0000" disabled={isPending} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contact_address">Address</Label>
            <Textarea id="contact_address" name="contact_address" defaultValue={s?.contact_address ?? ""} rows={2} disabled={isPending} />
          </div>
        </div>
      </section>

      {/* ── Social Links ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">Social Links</h2>
        <p className="text-xs text-muted-foreground -mt-2">Paste the full URL of your profile page (e.g. https://instagram.com/yourstudio)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { name: "social_instagram", label: "Instagram" },
            { name: "social_facebook", label: "Facebook" },
            { name: "social_twitter", label: "Twitter / X" },
            { name: "social_youtube", label: "YouTube" },
            { name: "social_linkedin", label: "LinkedIn" },
            { name: "social_pinterest", label: "Pinterest" },
          ].map(({ name, label }) => (
            <div key={name} className="space-y-1.5">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                type="url"
                defaultValue={(s?.[name as keyof SiteSettings] as string) ?? ""}
                placeholder={`https://${label.toLowerCase().replace(/\s.*/, "")}.com/...`}
                disabled={isPending}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Hero Section ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">Hero Section (Front Page Banner)</h2>
        <div className="space-y-1.5">
          <Label htmlFor="hero_heading">Main Heading *</Label>
          <Input id="hero_heading" name="hero_heading" defaultValue={s?.hero_heading ?? ""} required disabled={isPending} placeholder="Professional Photography & Design" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero_subheading">Subheading</Label>
          <Input id="hero_subheading" name="hero_subheading" defaultValue={s?.hero_subheading ?? ""} placeholder="Beautiful images, crafted with passion." disabled={isPending} />
        </div>
        <ImagePicker
          label="Hero Background Photo"
          value={heroId}
          onChange={setHeroId}
          uploadFolder="balaphoto/hero"
        />
      </section>

      {/* ── About Section ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">About Section</h2>
        <div className="space-y-1.5">
          <Label htmlFor="about_heading">About Heading *</Label>
          <Input id="about_heading" name="about_heading" defaultValue={s?.about_heading ?? ""} required disabled={isPending} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="about_body">About Text</Label>
          <Textarea id="about_body" name="about_body" defaultValue={s?.about_body ?? ""} rows={5} disabled={isPending} placeholder="Tell visitors your story, your passion, and what makes your studio unique..." />
        </div>
        <ImagePicker
          label="About Photo (portrait or studio)"
          value={aboutId}
          onChange={setAboutId}
          uploadFolder="balaphoto/about"
        />
      </section>

      {/* ── SEO ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-base font-semibold">SEO & Social Sharing</h2>
        <div className="space-y-1.5">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea id="meta_description" name="meta_description" defaultValue={s?.meta_description ?? ""} rows={2} maxLength={300} disabled={isPending} placeholder="Professional photography studio — portraits, events, branding..." />
          <p className="text-xs text-muted-foreground">Keep under 160 characters for the best results in Google search.</p>
        </div>
        <ImagePicker
          label="Social Sharing Image (shows when someone shares your link on WhatsApp, Facebook, etc.)"
          value={ogId}
          onChange={setOgId}
          uploadFolder="balaphoto/og"
        />
      </section>

      {/* ── Save button ── */}
      <div className="pb-10">
        <Button type="submit" disabled={isPending} size="lg" className="w-full sm:w-auto">
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
