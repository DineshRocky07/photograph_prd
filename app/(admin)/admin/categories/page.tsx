import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "./categories-client";
import type { Category } from "@/types";

export const metadata: Metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  const categories = (data as Category[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <CategoriesClient categories={categories} />
    </div>
  );
}
