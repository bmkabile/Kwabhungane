import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { InventoryTable } from "@/app/admin/inventory/InventoryTable";
import type { Product } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*").order("name");
  const list = (products ?? []) as Product[];

  const lowCount = list.filter((p) => p.stock > 0 && p.stock <= p.min_stock).length;
  const outCount = list.filter((p) => p.stock <= 0).length;

  return (
    <>
      <Topbar title="Inventory" subtitle="Stock levels across all products" />
      <div style={{ padding: "28px 30px 60px" }}>
        <div className="flex gap-5.5 flex-wrap mb-5 text-sm">
          <div>Total products: <b>{list.length}</b></div>
          <div>Low stock: <b className="text-warn">{lowCount}</b></div>
          <div>Out of stock: <b className="text-danger">{outCount}</b></div>
        </div>
        <InventoryTable products={list} />
      </div>
    </>
  );
}
