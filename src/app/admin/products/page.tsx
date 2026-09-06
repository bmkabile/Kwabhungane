import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { ProductsTable } from "@/app/admin/products/ProductsTable";
import type { Category, Product } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <>
      <Topbar title="Products" subtitle="Manage the Kwa Bhungane catalogue" />
      <div className="p-7.5" style={{ padding: "28px 30px 60px" }}>
        <ProductsTable products={(products ?? []) as Product[]} categories={(categories ?? []) as Category[]} />
      </div>
    </>
  );
}
