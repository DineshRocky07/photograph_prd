"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createService, updateService, deleteService } from "./actions";
import type { Service, Category } from "@/types";

type Props = { services: Service[]; categories: Category[] };

const EMPTY = {
  title: "", description: "", price_hint: "", category_id: "",
  cover_public_id: "", is_active: true, sort_order: 0,
};

export function ServicesClient({ services, categories }: Props) {
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
      const r = await createService(buildFD());
      if (r.success) { setShowCreate(false); setForm(EMPTY); }
      else setError(r.error ?? "Failed");
    });
  }

  function handleUpdate(svc: Service) {
    startTransition(async () => {
      const r = await updateService(svc.id, buildFD());
      if (r.success) setEditingId(null);
      else setError(r.error ?? "Failed");
    });
  }

  function handleDelete(svc: Service) {
    if (!confirm(`Delete service "${svc.title}"?`)) return;
    startTransition(async () => {
      const r = await deleteService(svc.id);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  function startEdit(svc: Service) {
    setForm({
      title: svc.title,
      description: svc.description ?? "",
      price_hint: svc.price_hint ?? "",
      category_id: svc.category_id ?? "",
      cover_public_id: svc.cover_public_id ?? "",
      is_active: svc.is_active,
      sort_order: svc.sort_order,
    });
    setEditingId(svc.id);
  }

  const FormFields = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">Title *</Label>
          <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Service title" className="h-8 text-xs" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe this service..." rows={3} className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Price hint</Label>
          <Input value={form.price_hint} onChange={(e) => setForm((f) => ({ ...f, price_hint: e.target.value }))} placeholder="e.g. Starting from $200" className="h-8 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <Select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="h-8 text-xs">
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sort order</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="h-8 text-xs" />
        </div>
        <div className="flex items-center gap-2 self-end">
          <input type="checkbox" id="svc_active" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
          <Label htmlFor="svc_active" className="text-xs cursor-pointer">Active</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={isPending || !form.title}>
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
        <Button onClick={() => { setShowCreate(true); setForm(EMPTY); }}><Plus className="h-4 w-4 mr-1" />Add Service</Button>
      </div>
      {showCreate && <div className="mb-4"><FormFields onSave={handleCreate} onCancel={() => setShowCreate(false)} /></div>}
      {services.length === 0 && !showCreate ? (
        <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">No services yet.</div>
      ) : (
        <div className="space-y-2">
          {services.map((svc) => (
            <div key={svc.id}>
              {editingId === svc.id ? (
                <FormFields onSave={() => handleUpdate(svc)} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                  <div>
                    <span className="font-medium">{svc.title}</span>
                    {svc.category && <span className="ml-2 text-xs text-muted-foreground">{svc.category.name}</span>}
                    {!svc.is_active && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">Inactive</span>}
                    {svc.price_hint && <p className="text-xs text-primary mt-0.5">{svc.price_hint}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(svc)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(svc)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
