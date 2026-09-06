import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { formatZAR } from "@/lib/format";
import type { Order, OrderItem, Product, Customer } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const supabase = createClient();
  const [{ data: orders }, { data: products }, { data: customers }] = await Promise.all([
    supabase.from("orders").select("*, order_items(*)"),
    supabase.from("products").select("*"),
    supabase.from("customers").select("*"),
  ]);

  const allOrders = (orders ?? []) as unknown as (Order & { order_items: OrderItem[] })[];
  const allProducts = (products ?? []) as Product[];
  const allCustomers = (customers ?? []) as Customer[];

  const totalOrders = allOrders.length;
  const completed = allOrders.filter((o) => o.status === "Delivered").length;
  const cancelled = allOrders.filter((o) => ["Cancelled", "Refunded"].includes(o.status)).length;
  const pending = allOrders.filter((o) => ["New", "Paid", "Processing", "Ready", "Shipped"].includes(o.status)).length;
  const revenue = allOrders.filter((o) => !["Cancelled", "Refunded"].includes(o.status)).reduce((s, o) => s + o.total, 0);

  const saleCount = (id: string) =>
    allOrders.reduce((s, o) => s + o.order_items.filter((i) => i.product_id === id).reduce((s2, i) => s2 + i.quantity, 0), 0);
  const bestSellers = [...allProducts].sort((a, b) => saleCount(b.id) - saleCount(a.id)).slice(0, 5);
  const slowSellers = [...allProducts].sort((a, b) => saleCount(a.id) - saleCount(b.id)).slice(0, 3);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const newCustomers = allCustomers.filter((c) => c.created_at >= thirtyDaysAgo).length;
  const returning = allCustomers.filter((c) => (statsFor(c.email, allOrders) ?? 0) > 1).length;

  function statsFor(email: string, orders: (Order & { order_items: OrderItem[] })[]) {
    return orders.filter((o) => o.customer_email === email).length;
  }

  return (
    <>
      <Topbar title="Reports & Analytics" subtitle="Sales, product and customer performance" />
      <div style={{ padding: "28px 30px 60px" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <Kpi label="Revenue (all-time)" value={formatZAR(revenue)} />
          <Kpi label="Total orders" value={totalOrders} />
          <Kpi label="Completed" value={completed} />
          <Kpi label="Cancelled / Refunded" value={cancelled} />
        </div>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 items-start">
          <div className="bg-white border border-[#EBE1CC] rounded p-5.5">
            <h3 className="text-base mb-4">Orders breakdown</h3>
            <Bar label="Pending / in progress" value={pending} total={totalOrders} color="#B6811F" />
            <Bar label="Completed" value={completed} total={totalOrders} color="#3E5A32" />
            <Bar label="Cancelled / refunded" value={cancelled} total={totalOrders} color="#A63A2E" />
          </div>
          <div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5 mb-5">
              <h3 className="text-base mb-4">Best sellers</h3>
              {bestSellers.map((p) => (
                <div key={p.id} className="flex justify-between text-[13px] py-2 border-b border-[#F1E9D8] last:border-0">
                  <span>{p.name}</span><b>{saleCount(p.id)} sold</b>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5 mb-5">
              <h3 className="text-base mb-4">Slow sellers</h3>
              {slowSellers.map((p) => (
                <div key={p.id} className="flex justify-between text-[13px] py-2 border-b border-[#F1E9D8] last:border-0">
                  <span>{p.name}</span><b>{saleCount(p.id)} sold</b>
                </div>
              ))}
            </div>
            <div className="bg-white border border-[#EBE1CC] rounded p-5.5">
              <h3 className="text-base mb-4">Customers</h3>
              <div className="flex justify-between text-[13px] py-1.5"><span>New (last 30 days)</span><span>{newCustomers}</span></div>
              <div className="flex justify-between text-[13px] py-1.5"><span>Returning customers</span><span>{returning}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-[#EBE1CC] rounded p-4">
      <div className="text-[11.5px] text-muted font-bold uppercase tracking-wide mb-2">{label}</div>
      <div className="font-serif text-2xl text-ink">{value}</div>
    </div>
  );
}
function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-[11.5px] text-muted mb-1"><span>{label}</span><span>{value}</span></div>
      <div className="bg-[#F1E9D8] rounded h-2 overflow-hidden"><div className="h-full rounded" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}
