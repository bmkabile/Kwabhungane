"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { formatZAR, formatDate } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_BADGE } from "@/lib/constants";
import type { Order, OrderItem, OrderStatus } from "@/lib/database.types";

type Row = Order & { order_items: OrderItem[]; branches: { name: string } | null };

export function OrdersTable({ orders }: { orders: Row[] }) {
  const [local, setLocal] = useState(orders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [, startTransition] = useTransition();

  function changeStatus(id: string, status: OrderStatus) {
    setLocal((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    startTransition(() => {
      updateOrderStatus(id, status);
    });
  }

  const filtered = local.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="flex justify-between gap-3 flex-wrap items-center mb-4">
        <input className="border border-[#EBE1CC] rounded px-3 py-2 text-sm min-w-[220px]" placeholder="Search order # or customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border border-[#EBE1CC] rounded px-2.5 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["All", ...ORDER_STATUS_FLOW].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white border border-[#EBE1CC] rounded overflow-x-auto">
        <table className="w-full text-[13.5px] border-collapse min-w-[920px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-[#EBE1CC]">
              <th className="py-2.5 px-2.5">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Delivery</th><th>Branch</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[#F1E9D8] last:border-0">
                <td className="py-2.5 px-2.5 font-bold text-ember-600">{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td>{o.order_items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td>{formatZAR(o.total)}</td>
                <td><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${o.payment_status === "Paid" ? "bg-ok-soft text-ok" : o.payment_status === "Refunded" ? "bg-cream-2 text-bark" : "bg-warn-soft text-warn"}`}>{o.payment_status}</span></td>
                <td className="capitalize">{o.delivery_method}</td>
                <td><span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EDE3F0] text-[#63417A]">{o.branches?.name ?? "—"}</span></td>
                <td className="text-muted">{formatDate(o.created_at)}</td>
                <td>
                  <select
                    className="border border-[#EBE1CC] rounded-full px-2.5 py-1 text-xs font-bold"
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value as OrderStatus)}
                  >
                    {ORDER_STATUS_FLOW.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center text-muted py-10">No orders match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
