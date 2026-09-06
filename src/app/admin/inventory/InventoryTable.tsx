"use client";

import { useState, useTransition } from "react";
import { adjustStock } from "@/app/admin/products/actions";
import type { Product } from "@/lib/database.types";

export function InventoryTable({ products }: { products: Product[] }) {
  const [local, setLocal] = useState(products);
  const [, startTransition] = useTransition();

  function bump(id: string, delta: number) {
    setLocal((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
    startTransition(() => {
      adjustStock(id, delta);
    });
  }

  const sorted = [...local].sort((a, b) => a.stock / Math.max(a.min_stock, 1) - b.stock / Math.max(b.min_stock, 1));

  return (
    <div className="bg-white border border-[#EBE1CC] rounded overflow-x-auto">
      <table className="w-full text-[13.5px] border-collapse min-w-[720px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-[#EBE1CC]">
            <th className="py-2.5 px-2.5">Product</th><th>Stock</th><th>Minimum</th><th>Status</th><th className="w-40">Stock level</th><th>Update stock</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const status = p.stock <= 0 ? { label: "Out of stock", cls: "bg-danger-soft text-danger" } : p.stock <= p.min_stock ? { label: "Low stock", cls: "bg-warn-soft text-warn" } : { label: "In stock", cls: "bg-ok-soft text-ok" };
            const pct = Math.min(100, Math.round((p.stock / Math.max(p.min_stock * 3, 1)) * 100));
            const barColor = p.stock <= 0 ? "#A63A2E" : p.stock <= p.min_stock ? "#B6811F" : "#3E5A32";
            return (
              <tr key={p.id} className="border-b border-[#F1E9D8] last:border-0">
                <td className="py-2.5 px-2.5 font-medium">{p.name}</td>
                <td className="font-bold">{p.stock}</td>
                <td className="text-muted">{p.min_stock}</td>
                <td><span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span></td>
                <td><div className="bg-[#F1E9D8] rounded h-2 overflow-hidden"><div className="h-full rounded" style={{ width: `${pct}%`, background: barColor }} /></div></td>
                <td>
                  <div className="inline-flex items-center border border-[#EBE1CC] rounded overflow-hidden">
                    <button onClick={() => bump(p.id, -1)} className="w-7 h-7 hover:bg-cream-2">−</button>
                    <span className="w-10 text-center text-sm">{p.stock}</span>
                    <button onClick={() => bump(p.id, 1)} className="w-7 h-7 hover:bg-cream-2">+</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
