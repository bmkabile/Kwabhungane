import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { formatZAR } from "@/lib/format";
import { ORDER_STATUS_BADGE } from "@/lib/constants";
import type { Order, Product } from "@/lib/database.types";

export const dynamic = "force-dynamic";

function Kpi({ label, value, delta, tone }: { label: string; value: string | number; delta?: string; tone?: "up" | "down" }) {
  return (
    <div className="bg-white border border-[#EBE1CC] rounded p-4">
      <div className="text-[11.5px] text-muted font-bold uppercase tracking-wide mb-2">{label}</div>
      <div className="font-serif text-2xl text-ink">{value}</div>
      {delta && <div className={`text-[11.5px] mt-1.5 font-bold ${tone === "down" ? "text-danger" : "text-ok"}`}>{delta}</div>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ data: products }, { data: orders }, { count: customerCount }] = await Promise.all([
    supabase.from("products").select("*").order("stock", { ascending: true }),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    supabase.from("customers").select("*", { count: "exact", head: true }),
  ]);

  const allProducts = (products ?? []) as Product[];
  const allOrders = (orders ?? []) as unknown as (Order & { order_items: { product_id: string | null; quantity: number }[] })[];

  const today = new Date().toISOString().slice(0, 10);
  const ordersToday = allOrders.filter((o) => o.created_at.slice(0, 10) === today);
  const pending = allOrders.filter((o) => ["New", "Paid", "Processing"].includes(o.status)).length;
  const lowStock = allProducts.filter((p) => p.stock > 0 && p.stock <= p.min_stock).length;
  const outStock = allProducts.filter((p) => p.stock <= 0).length;
  const revenue = allOrders.filter((o) => !["Cancelled", "Refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0);
  const todaySales = ordersToday.reduce((s, o) => s + o.total, 0);

  const saleCount = (id: string) =>
    allOrders.reduce((s, o) => s + o.order_items.filter((i) => i.product_id === id).reduce((s2, i) => s2 + i.quantity, 0), 0);
  const bestSellers = [...allProducts].sort((a, b) => saleCount(b.id) - saleCount(a.id)).slice(0, 5);
  const lowStockList = allProducts.filter((p) => p.stock <= p.min_stock).sort((a, b) => a.stock - b.stock).slice(0, 5);
  const recentOrders = allOrders.slice(0, 6);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Today's snapshot across all branches" />
      <div className="p-7.5 pb-16" style={{ padding: "28px 30px 60px" }}>
        {lowStock + outStock > 0 && (
          <div className="bg-danger-soft text-danger rounded px-4.5 py-3.5 text-[13.5px] font-semibold mb-5 flex gap-2.5 items-center">
            ⚠ {outStock} product{outStock === 1 ? "" : "s"} out of stock, {lowStock} running low.{" "}
            <Link href="/admin/inventory" className="underline">Review inventory →</Link>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 mb-6.5">
          <Kpi label="Today's Sales" value={formatZAR(todaySales)} />
          <Kpi label="Orders Today" value={ordersToday.length} />
          <Kpi label="Pending Orders" value={pending} delta={pending > 3 ? "Needs attention" : undefined} tone="down" />
          <Kpi label="Low Stock" value={lowStock + outStock} delta={outStock > 0 ? `${outStock} out of stock` : undefined} tone="down" />
          <Kpi label="Customers" value={customerCount ?? 0} />
          <Kpi label="Revenue (all-time)" value={formatZAR(revenue)} />
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 items-start">
          <div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base m-0">Recent orders</h3>
                <Link href="/admin/orders" className="text-ember-600 text-[12.5px] font-bold">View all</Link>
              </div>
              <table className="w-full text-[13.5px] border-collapse">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
                    <th className="pb-2.5">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-[#F1E9D8]">
                      <td className="py-2.5 font-bold text-ember-600">{o.order_number}</td>
                      <td>{o.customer_name}</td>
                      <td>{o.order_items.reduce((s, i) => s + i.quantity, 0)}</td>
                      <td>{formatZAR(o.total)}</td>
                      <td><span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${ORDER_STATUS_BADGE[o.status]}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5 mb-5">
              <h3 className="text-base mb-4">Best-selling products</h3>
              {bestSellers.map((p) => (
                <div key={p.id} className="flex justify-between text-[13px] py-2 border-b border-[#F1E9D8] last:border-0">
                  <span className="truncate">{p.name}</span><span className="text-muted">{saleCount(p.id)} sold</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base m-0">Low stock products</h3>
                <Link href="/admin/inventory" className="text-ember-600 text-[12.5px] font-bold">Manage</Link>
              </div>
              {lowStockList.length ? lowStockList.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-[#F1E9D8] last:border-0">
                  <span className="text-[13px] font-semibold">{p.name}</span>
                  <span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full ${p.stock <= 0 ? "bg-danger-soft text-danger" : "bg-warn-soft text-warn"}`}>{p.stock} left</span>
                </div>
              )) : <div className="text-center text-muted text-[13.5px] py-4">All products are well stocked.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
