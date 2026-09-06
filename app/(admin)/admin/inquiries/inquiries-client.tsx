"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, Archive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatDate, inquiryStatusColor } from "@/lib/utils";
import { INQUIRY_STATUS_LABELS } from "@/types";
import { updateInquiryStatus, archiveInquiry, deleteInquiry } from "./actions";
import type { Inquiry, InquiryStatus } from "@/types";

type Props = {
  inquiries: Inquiry[];
  currentStatus: string;
  showArchived: boolean;
};

const ALL_STATUSES = Object.entries(INQUIRY_STATUS_LABELS) as [InquiryStatus, string][];

export function InquiriesClient({ inquiries, currentStatus, showArchived }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      const r = await updateInquiryStatus(id, status);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  function handleArchive(id: string) {
    startTransition(async () => {
      const r = await archiveInquiry(id);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Permanently delete inquiry from "${name}"?`)) return;
    startTransition(async () => {
      const r = await deleteInquiry(id);
      if (!r.success) setError(r.error ?? "Failed");
    });
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/inquiries?status=all"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${currentStatus === "all" && !showArchived ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
        >
          All Active
        </Link>
        {ALL_STATUSES.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/inquiries?status=${key}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${currentStatus === key && !showArchived ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/admin/inquiries?archived=true"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${showArchived ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
        >
          Archived
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error} <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {isPending && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Updating...
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
          No inquiries here.
        </div>
      ) : (
        <div className="space-y-2">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-lg border bg-card overflow-hidden">
              {/* Header row */}
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{inq.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inquiryStatusColor(inq.status)}`}>
                      {INQUIRY_STATUS_LABELS[inq.status]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inq.email} · {formatDate(inq.created_at)}
                  </p>
                  {inq.subject && (
                    <p className="text-xs text-muted-foreground">Subject: {inq.subject}</p>
                  )}
                </div>

                {/* Status dropdown */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="h-7 text-xs w-36"
                  >
                    {ALL_STATUSES.map(([k, l]) => (
                      <option key={k} value={k}>{l}</option>
                    ))}
                  </Select>
                  {!showArchived && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleArchive(inq.id)}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(inq.id, inq.name)}
                    className="text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded message */}
              {expandedId === inq.id && (
                <div className="border-t px-4 py-3 bg-muted/10 space-y-2">
                  {inq.phone && (
                    <p className="text-xs"><span className="font-medium">Phone:</span> {inq.phone}</p>
                  )}
                  <div>
                    <p className="text-xs font-medium mb-1">Message:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inq.message}</p>
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
