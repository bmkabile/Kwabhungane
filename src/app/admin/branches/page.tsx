import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { formatZAR } from "@/lib/format";
import type { Branch, Order } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
  const supabase = createClient();
  const [{ data: branches }, { data: orders }] = await Promise.all([
    supabase.from("branches").select("*").order("is_head_office", { ascending: false }),
    supabase.from("orders").select("branch_id, total").not("status", "in", "(Cancelled,Refunded)"),
  ]);

  const list = (branches ?? []) as Branch[];
  const orderRows = (orders ?? []) as Pick<Order, "branch_id" | "total">[];
  const salesByBranch = new Map<string, number>();
  for (const o of orderRows) {
    if (!o.branch_id) continue;
    salesByBranch.set(o.branch_id, (salesByBranch.get(o.branch_id) ?? 0) + o.total);
  }
  const maxSales = Math.max(1, ...list.map((b) => salesByBranch.get(b.id) ?? 0));

  return (
    <>
      <Topbar title="Branches" subtitle="Newcastle, Madadeni and Nelspruit" />
      <div style={{ padding: "28px 30px 60px" }}>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {list.map((b) => (
            <div key={b.id} className="bg-white border border-[#EBE1CC] rounded p-5.5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-base m-0">{b.name}</h3>
                {b.is_head_office && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#DCE4EE] text-[#33517A]">Head Office</span>}
              </div>
              <div className="text-[13px] text-muted mb-1">Manager: <b className="text-ink">{b.manager || "—"}</b></div>
              <div className="text-[13px] text-muted mb-1">Sales (all-time): <b className="text-ink">{formatZAR(salesByBranch.get(b.id) ?? 0)}</b></div>
              <div className="text-[13.5px] text-muted leading-relaxed mt-3">
                {b.address}<br />{b.phone} · {b.hours}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#EBE1CC] rounded p-5.5">
          <h3 className="text-base mb-1.5">Branch-level sales</h3>
          <p className="text-[13.5px] text-muted mb-4">
            Branches are already modelled as a proper database entity (see <code>branch_stock</code> in the schema),
            so per-branch inventory can be switched on later without rebuilding the system.
          </p>
          {list.map((b) => {
            const sales = salesByBranch.get(b.id) ?? 0;
            return (
              <div key={b.id} className="mb-3.5">
                <div className="flex justify-between text-[11.5px] text-muted mb-1"><span>{b.name}</span><span>{formatZAR(sales)}</span></div>
                <div className="bg-[#F1E9D8] rounded h-2 overflow-hidden"><div className="h-full bg-leaf-700 rounded" style={{ width: `${Math.round((sales / maxSales) * 100)}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
