import { createClient } from "@/lib/supabase/server";
import type { Product, Category, Branch } from "@/lib/database.types";

/**
 * Read-only queries used across the public site. These run against
 * the anon key and rely on the RLS policies in
 * supabase/migrations/0001_init.sql (active products + all
 * categories/branches are public).
 */

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getBranches(): Promise<Branch[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("branches").select("*").order("is_head_office", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryMap(): Promise<Record<string, string>> {
  const categories = await getCategories();
  return Object.fromEntries(categories.map((c) => [c.id, c.name]));
}
