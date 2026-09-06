import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ServicesClient } from "./services-client";
import type { Service, Category } from "@/types";

export const metadata: Metadata = { title: "Services | Admin" };

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const [servicesRes, categoriesRes] = await Promise.all([
    supabase.from("services").select("*, category:categories(*)").order("sort_order"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const services = (servicesRes.data as Service[]) ?? [];
  const categories = (categoriesRes.data as Category[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Services</h1>
      <ServicesClient services={services} categories={categories} />
    </div>
  );
}
