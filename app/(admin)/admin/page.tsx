import { createClient } from "@/lib/supabase/server";
import { Images, FolderOpen, Briefcase, MessageSquare, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | Admin" };

async function getStats() {
  const supabase = await createClient();
  const [gallery, categories, services, inquiries, testimonials] =
    await Promise.all([
      supabase.from("gallery").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("services").select("id", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .eq("is_archived", false),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
    ]);

  return {
    gallery: gallery.count ?? 0,
    categories: categories.count ?? 0,
    services: services.count ?? 0,
    newInquiries: inquiries.count ?? 0,
    testimonials: testimonials.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Gallery Images",
      value: stats.gallery,
      icon: Images,
      href: "/admin/gallery",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FolderOpen,
      href: "/admin/categories",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Briefcase,
      href: "/admin/services",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "New Inquiries",
      value: stats.newInquiries,
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Published Testimonials",
      value: stats.testimonials,
      icon: Star,
      href: "/admin/testimonials",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, href, color, bg }) => (
          <a
            key={href}
            href={href}
            className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow group"
          >
            <div className={`inline-flex rounded-lg p-2.5 ${bg} mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5 group-hover:text-foreground transition-colors">
              {label}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-2">Quick Tips</h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Upload photos in <a href="/admin/gallery" className="text-primary hover:underline">Gallery</a> and toggle &quot;Published&quot; to make them live.</li>
          <li>Edit your business info, hero text, and social links in <a href="/admin/settings" className="text-primary hover:underline">Settings</a>.</li>
          <li>Create categories first so you can organise your gallery and services.</li>
          <li>New contact form submissions appear in <a href="/admin/inquiries" className="text-primary hover:underline">Inquiries</a>.</li>
        </ul>
      </div>
    </div>
  );
}
