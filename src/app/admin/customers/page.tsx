import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { formatZAR, formatDate } from "@/lib/format";
import type { Customer, Order } from "@/lib/database.types";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const [{ data: customers }, { data: orders }] = await Promise.all([
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("customer_email, total, created_at"),
  ]);

  const list = (customers ?? []) as Customer[];
  const orderRows = (orders ?? []) as Pick<Order, "customer_email" | "total" | "created_at">[];

  const statsByEmail = new Map<string, { count: number; spent: number; last: string }>();
  for (const o of orderRows) {
    const cur = statsByEmail.get(o.customer_email) ?? { count: 0, spent: 0, last: o.created_at };
    cur.count += 1;
    cur.spent += o.total;
    if (o.created_at > cur.last) cur.last = o.created_at;
    statsByEmail.set(o.customer_email, cur);
  }

  return (
    <>
      <Topbar title="Customers" subtitle="Your centralised customer database" />
      <div style={{ padding: "28px 30px 60px" }}>
        <div className="bg-white border border-[#EBE1CC] rounded overflow-x-auto">
          <table className="w-full text-[13.5px] border-collapse min-w-[760px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-[#EBE1CC]">
                <th className="py-2.5 px-2.5">Customer</th><th>Contact</th><th>Orders</th><th>Total spent</th><th>Joined</th><th>Last order</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const stats = statsByEmail.get(c.email);
                return (
                  <tr key={c.id} className="border-b border-[#F1E9D8] last:border-0">
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7.5 h-7.5 rounded-full bg-leaf-soft text-leaf-700 flex items-center justify-center text-xs font-extrabold shrink-0" style={{ width: 30, height: 30 }}>{initials(c.name)}</div>
                        {c.name}
                      </div>
                    </td>
                    <td className="text-muted">{c.email}<br />{c.phone}</td>
                    <td>{stats?.count ?? 0}</td>
                    <td className="font-bold">{formatZAR(stats?.spent ?? 0)}</td>
                    <td className="text-muted">{formatDate(c.created_at)}</td>
                    <td className="text-muted">{stats ? formatDate(stats.last) : "—"}</td>
                    <td><span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full ${c.status === "Active" ? "bg-ok-soft text-ok" : "bg-cream-2 text-bark"}`}>{c.status}</span></td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted py-10">No customers yet — they appear here automatically after checkout.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
