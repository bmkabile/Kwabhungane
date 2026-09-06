"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";

export interface ProductInput {
  id?: string;
  name: string;
  sku: string;
  categoryId: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  minStock: number;
  active: boolean;
  featured: boolean;
  description: string;
  ingredientsInfo: string;
  usageInfo: string;
}

export async function saveProduct(input: ProductInput) {
  const supabase = createClient();
  const payload = {
    name: input.name,
    sku: input.sku,
    slug: slugify(input.name),
    category_id: input.categoryId,
    price: input.price,
    sale_price: input.salePrice,
    stock: input.stock,
    min_stock: input.minStock,
    active: input.active,
    featured: input.featured,
    description: input.description,
    ingredients_info: input.ingredientsInfo,
    usage_info: input.usageInfo,
  };

  const { error } = input.id
    ? await supabase.from("products").update(payload).eq("id", input.id)
    : await supabase.from("products").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
}

export async function setProductActive(id: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function adjustStock(id: string, delta: number) {
  const supabase = createClient();
  const { data: product, error: fetchErr } = await supabase.from("products").select("stock").eq("id", id).single();
  if (fetchErr || !product) throw new Error(fetchErr?.message ?? "Product not found");

  const nextStock = Math.max(0, product.stock + delta);
  const { error } = await supabase.from("products").update({ stock: nextStock }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/dashboard");
  revalidatePath("/shop");
}
