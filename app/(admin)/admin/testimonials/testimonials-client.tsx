"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus, Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
} from "./actions";
import type { Testimonial } from "@/types";

type Props = { testimonials: Testimonial[] };

const EMPTY = {
  client_name: "",
  client_title: "",
  quote: "",
  rating: 5,
  avatar_url: "",
  is_published: false,
  sort_order: 0,
};

export function TestimonialsClient({ testimonials }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildFD() {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));
    return fd;
  }

  function handleCreate() {
    startTransition(async () => {
      const r = await createTestimonial(buildFD());
      if (r.success) { setShowCreate(false); setForm(EMPTY); }
      else setError(r.error ?? "Failed");
    });
  }

  function handleUpdate(t: Testimonial) {
    startTransition(async () => {
      const r = await updateTestimonial(t.id, buildFD());
      if (r.success) setEditingId(null);
      else setError(r.error ?? "Failed");
    });
  }

  function handleDelete(t: Testimonial) {
    if (!confirm(`Delete testimonial from "${t.client_name}"?`)) return;
    startTransition(async () => {
      const r = await deleteTestimonial(t.id);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  function handleToggle(t: Testimonial) {
    startTransition(async () => {
      const r = await toggleTestimonialPublished(t.id, t.is_published);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  function startEdit(t: Testimonial) {
    setForm({
      client_name: t.client_name,
      client_title: t.client_title ?? "",
      quote: t.quote,
      rating: t.rating ?? 5,
      avatar_url: t.avatar_url ?? "",
      is_published: t.is_published,
      sort_order: t.sort_order,
    });
    setEditingId(t.id);
  }

  const FormFields = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Client Name *</Label>
          <Input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} placeholder="Jane Smith" className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Title / Role</Label>
          <Input value={form.client_title} onChange={(e) => setForm((f) => ({ ...f, client_title: e.target.value }))} placeholder="Wedding Client" className="h-8 text-xs" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">Quote *</Label>
          <Textarea value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} placeholder="What they said..." rows={3} className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Rating (1-5)</Label>
          <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value) || 5 }))} className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sort order</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="h-8 text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="t_published" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
          <Label htmlFor="t_published" className="text-xs cursor-pointer">Published</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={isPending || !form.client_name || !form.quote}>
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}><X className="h-3 w-3 mr-1" />Cancel</Button>
      </div>
    </div>
  );

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error} <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div className="mb-4 flex justify-end">
        <Button onClick={() => { setShowCreate(true); setForm(EMPTY); }}><Plus className="h-4 w-4 mr-1" />Add Testimonial</Button>
      </div>
      {showCreate && <div className="mb-4"><FormFields onSave={handleCreate} onCancel={() => setShowCreate(false)} /></div>}
      {testimonials.length === 0 && !showCreate ? (
        <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">No testimonials yet.</div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id}>
              {editingId === t.id ? (
                <FormFields onSave={() => handleUpdate(t)} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="rounded-lg border bg-card px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{t.client_name}</span>
                        {t.client_title && <span className="text-xs text-muted-foreground">{t.client_title}</span>}
                        {t.rating && <span className="text-xs text-yellow-500">{"★".repeat(t.rating)}</span>}
                        {!t.is_published && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Draft</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleToggle(t)} title={t.is_published ? "Unpublish" : "Publish"}>
                        {t.is_published ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
