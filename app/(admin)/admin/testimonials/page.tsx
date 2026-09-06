import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TestimonialsClient } from "./testimonials-client";
import type { Testimonial } from "@/types";

export const metadata: Metadata = { title: "Testimonials | Admin" };

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");
  const testimonials = (data as Testimonial[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Testimonials</h1>
      <TestimonialsClient testimonials={testimonials} />
    </div>
  );
}
