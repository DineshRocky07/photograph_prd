"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import type { Category } from "@/types";

type Props = { categories: Category[] };

const EMPTY_FORM = { name: "", slug: "", description: "", is_active: true, sort_order: 0 };

export function CategoriesClient({ categories }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildFormData(data: typeof EMPTY_FORM) {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.set(k, String(v)));
    return fd;
  }

  function handleCreate() {
    startTransition(async () => {
      const result = await createCategory(buildFormData(form));
      if (result.success) { setShowCreate(false); setForm(EMPTY_FORM); }
      else setError(result.error ?? "Failed");
    });
  }

  function handleUpdate(cat: Category) {
    startTransition(async () => {
      const result = await updateCategory(cat.id, buildFormData(form));
      if (result.success) setEditingId(null);
      else setError(result.error ?? "Failed");
    });
  }

  function handleDelete(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategory(cat.id);
      if (!result.success) setError(result.error ?? "Failed");
    });
  }

  function startEdit(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      is_active: cat.is_active,
      sort_order: cat.sort_order,
    });
    setEditingId(cat.id);
  }

  const FormFields = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
            placeholder="e.g. Weddings"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Slug *</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="e.g. weddings"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs">Description</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional description"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sort order</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 self-end">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          <Label htmlFor="is_active" className="text-xs cursor-pointer">Active</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={isPending || !form.name || !form.slug}>
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
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
        <Button onClick={() => { setShowCreate(true); setForm(EMPTY_FORM); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {showCreate && (
        <div className="mb-4">
          <FormFields onSave={handleCreate} onCancel={() => setShowCreate(false)} />
        </div>
      )}

      {categories.length === 0 && !showCreate ? (
        <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
          No categories yet. Add one above.
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                <FormFields onSave={() => handleUpdate(cat)} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                  <div>
                    <span className="font-medium">{cat.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">/{cat.slug}</span>
                    {!cat.is_active && (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">Inactive</span>
                    )}
                    {cat.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
