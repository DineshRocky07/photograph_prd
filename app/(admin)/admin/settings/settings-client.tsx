"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Loader2, Save } from "lucide-react";
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

  // Track which section is saving/saved
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // All form field states
  const [formData, setFormData] = useState({
    business_name: s?.business_name ?? "Bala Photography",
    tagline: s?.tagline ?? "Capturing moments that last forever",
    logo_public_id: s?.logo_public_id ?? "",
    contact_email: s?.contact_email ?? "",
    contact_phone: s?.contact_phone ?? "",
    contact_address: s?.contact_address ?? "",
    social_instagram: s?.social_instagram ?? "",
    social_facebook: s?.social_facebook ?? "",
    social_twitter: s?.social_twitter ?? "",
    social_youtube: s?.social_youtube ?? "",
    social_linkedin: s?.social_linkedin ?? "",
    social_pinterest: s?.social_pinterest ?? "",
    hero_heading: s?.hero_heading ?? "Professional Photography & Graphic Design",
    hero_subheading: s?.hero_subheading ?? "",
    hero_image_public_id: s?.hero_image_public_id ?? "",
    about_heading: s?.about_heading ?? "About Us",
    about_body: s?.about_body ?? "",
    about_image_public_id: s?.about_image_public_id ?? "",
    meta_description: s?.meta_description ?? "",
    og_image_public_id: s?.og_image_public_id ?? "",
  });

  function updateField(key: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Save function called by any section save button
  async function handleSave(sectionName: string) {
    setGlobalError(null);
    setSavingSection(sectionName);
    setSavedSection(null);

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      fd.set(k, v);
    });

    startTransition(async () => {
      try {
        const result = await saveSettings(fd);
        if (result.success) {
          setSavedSection(sectionName);
          setTimeout(() => setSavedSection((cur) => (cur === sectionName ? null : cur)), 4000);
        } else {
          setGlobalError(result.error ?? "Failed to save settings. Please try again.");
        }
      } catch (err) {
        setGlobalError(err instanceof Error ? err.message : "Error saving settings");
      } finally {
        setSavingSection(null);
      }
    });
  }

  function renderSectionHeader(title: string, sectionId: string) {
    const isSaving = savingSection === sectionId;
    const isSaved = savedSection === sectionId;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
              <CheckCircle className="h-3.5 w-3.5" /> Saved!
            </span>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => handleSave(sectionId)}
            disabled={isSaving}
            className="flex items-center gap-1.5 font-medium shadow-sm"
          >
            {isSaving ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
            ) : (
              <><Save className="h-3.5 w-3.5" /> Save {title.split(" ")[0]}</>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl pb-16">
      {/* Global alert error if any */}
      {globalError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <strong>Could not save:</strong> {globalError}
        </div>
      )}

      {/* ── 1. Business Identity ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("Business Identity", "identity")}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => updateField("business_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="Capturing moments that last forever"
            />
          </div>
        </div>

        <div className="pt-2">
          <ImagePicker
            label="Business Logo (appears in the header)"
            value={formData.logo_public_id}
            onChange={(val) => {
              updateField("logo_public_id", val);
            }}
            uploadFolder="balaphoto/branding"
          />
          <p className="text-xs text-muted-foreground mt-2">
            After choosing or uploading a logo, click <strong>Save Business</strong> above to update the site immediately.
          </p>
        </div>
      </section>

      {/* ── 2. Contact Information ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("Contact Information", "contact")}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="hello@yourstudio.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_phone">Phone / WhatsApp Number</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
            <p className="text-[11px] text-muted-foreground">
              Used for direct 1-tap WhatsApp chat buttons on your website.
            </p>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contact_address">Address / Studio Location</Label>
            <Textarea
              id="contact_address"
              value={formData.contact_address}
              onChange={(e) => updateField("contact_address", e.target.value)}
              rows={2}
              placeholder="Chennai, Tamil Nadu, India"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Social Links ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("Social Links", "social")}
        <p className="text-xs text-muted-foreground -mt-2">
          Paste the full URL of your profile page (e.g. https://instagram.com/yourstudio)
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { key: "social_instagram" as const, label: "Instagram" },
            { key: "social_facebook" as const, label: "Facebook" },
            { key: "social_twitter" as const, label: "Twitter / X" },
            { key: "social_youtube" as const, label: "YouTube" },
            { key: "social_linkedin" as const, label: "LinkedIn" },
            { key: "social_pinterest" as const, label: "Pinterest" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="url"
                value={formData[key]}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={`https://${label.toLowerCase().replace(/\s.*/, "")}.com/...`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Hero Section ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("Hero Section", "hero")}
        <div className="space-y-1.5">
          <Label htmlFor="hero_heading">Hero Heading</Label>
          <Input
            id="hero_heading"
            value={formData.hero_heading}
            onChange={(e) => updateField("hero_heading", e.target.value)}
            placeholder="Professional Photography & Graphic Design"
          />
          <p className="text-xs text-muted-foreground">
            Appears at the bottom of the photo slideshow so the photo itself is clear and unobstructed.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hero_subheading">Subheading</Label>
          <Input
            id="hero_subheading"
            value={formData.hero_subheading}
            onChange={(e) => updateField("hero_subheading", e.target.value)}
            placeholder="Capturing moments that last forever"
          />
        </div>
        <ImagePicker
          label="Hero Fallback Photo (used if no gallery photos are uploaded yet)"
          value={formData.hero_image_public_id}
          onChange={(val) => updateField("hero_image_public_id", val)}
          uploadFolder="balaphoto/hero"
        />
      </section>

      {/* ── 5. About Section ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("About Section", "about")}
        <div className="space-y-1.5">
          <Label htmlFor="about_heading">About Heading *</Label>
          <Input
            id="about_heading"
            value={formData.about_heading}
            onChange={(e) => updateField("about_heading", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="about_body">About Text</Label>
          <Textarea
            id="about_body"
            value={formData.about_body}
            onChange={(e) => updateField("about_body", e.target.value)}
            rows={5}
            placeholder="Tell visitors your story, your passion, and what makes your studio unique..."
          />
        </div>
        <ImagePicker
          label="About Photo (portrait or studio)"
          value={formData.about_image_public_id}
          onChange={(val) => updateField("about_image_public_id", val)}
          uploadFolder="balaphoto/about"
        />
      </section>

      {/* ── 6. SEO & Social Sharing ── */}
      <section className="rounded-xl border bg-card p-6 space-y-5 shadow-sm">
        {renderSectionHeader("SEO & Social Sharing", "seo")}
        <div className="space-y-1.5">
          <Label htmlFor="meta_description">Meta Description (shown on Google search results)</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => updateField("meta_description", e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="Professional photography studio in Chennai — weddings, portraits, events, branding..."
          />
          <p className="text-xs text-muted-foreground">Keep under 160 characters for the best results on Google search.</p>
        </div>
        <div className="pt-2">
          <ImagePicker
            label="Social Sharing Image (shows when you share your website link on WhatsApp, Facebook, Instagram)"
            value={formData.og_image_public_id}
            onChange={(val) => updateField("og_image_public_id", val)}
            uploadFolder="balaphoto/og"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Recommended size: 1200 × 630 pixels. After selecting, click <strong>Save SEO</strong> to update.
          </p>
        </div>
      </section>

      {/* Bottom Save All shortcut */}
      <div className="pt-4 border-t flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Tip: You can save each section individually above, or save everything at once here.
        </p>
        <Button
          type="button"
          size="lg"
          onClick={() => handleSave("all")}
          disabled={savingSection !== null}
          className="shadow-sm"
        >
          {savingSection === "all" ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving all…</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save All Settings</>
          )}
        </Button>
      </div>
    </div>
  );
}
