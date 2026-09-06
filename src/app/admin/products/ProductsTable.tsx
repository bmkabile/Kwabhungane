"use client";

import { useMemo, useState } from "react";
import { saveProduct, setProductActive, type ProductInput } from "@/app/admin/products/actions";
import { formatZAR } from "@/lib/format";
import type { Category, Product } from "@/lib/database.types";

function stockBadge(p: Product) {
  if (p.stock <= 0) return { label: "Out of stock", cls: "bg-danger-soft text-danger" };
  if (p.stock <= p.min_stock) return { label: "Low", cls: "bg-warn-soft text-warn" };
  return { label: "In stock", cls: "bg-ok-soft text-ok" };
}

const emptyForm = (categories: Category[]): ProductInput => ({
  name: "", sku: "", categoryId: categories[0]?.id ?? null, price: 0, salePrice: null,
  stock: 0, minStock: 5, active: true, featured: false, description: "", ingredientsInfo: "", usageInfo: "",
});

export function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [filter, setFilter] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined); // undefined = closed
  const [saving, setSaving] = useState(false);
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(filter.toLowerCase()) || p.sku.toLowerCase().includes(filter.toLowerCase())
  );

  async function handleArchive(p: Product) {
    await setProductActive(p.id, !p.active);
  }

  return (
    <>
      <div className="flex justify-between gap-3 flex-wrap items-center mb-4">
        <input
          className="border border-[#EBE1CC] rounded px-3 py-2 text-sm min-w-[220px]"
          placeholder="Search products…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={() => setModalProduct(null)}
          className="px-4 py-2 rounded bg-ember-600 hover:bg-ember-700 text-white text-sm font-bold"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-[#EBE1CC] rounded overflow-x-auto">
        <table className="w-full text-[13.5px] border-collapse min-w-[820px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted border-b border-[#EBE1CC]">
              <th className="py-2.5 px-2.5">Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Featured</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const badge = stockBadge(p);
              return (
                <tr key={p.id} className="border-b border-[#F1E9D8] last:border-0 hover:bg-[#FBF6EC]">
                  <td className="py-2.5 px-2.5 font-medium">{p.name}</td>
                  <td className="text-muted">{p.sku}</td>
                  <td>{p.category_id ? categoryMap[p.category_id] : "—"}</td>
                  <td>{p.sale_price ? <><span className="line-through text-muted text-xs mr-1">{formatZAR(p.price)}</span>{formatZAR(p.sale_price)}</> : formatZAR(p.price)}</td>
                  <td><span className={`text-[11.5px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{p.stock}</span></td>
                  <td>{p.active ? <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-ok-soft text-ok">Active</span> : <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-cream-2 text-bark">Inactive</span>}</td>
                  <td>{p.featured ? "⭐" : ""}</td>
                  <td className="text-right whitespace-nowrap px-2.5">
                    <button onClick={() => setModalProduct(p)} className="text-xs font-bold border border-ember-600 text-ember-700 rounded px-2.5 py-1.5 mr-1.5 hover:bg-ember-600 hover:text-white">Edit</button>
                    <button onClick={() => handleArchive(p)} className="text-xs font-bold text-danger px-1.5 py-1.5">{p.active ? "Archive" : "Restore"}</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-10">No products match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          categories={categories}
          saving={saving}
          onCancel={() => setModalProduct(undefined)}
          onSave={async (input) => {
            setSaving(true);
            try {
              await saveProduct(input);
              setModalProduct(undefined);
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </>
  );
}

function ProductModal({
  product, categories, saving, onCancel, onSave,
}: {
  product: Product | null;
  categories: Category[];
  saving: boolean;
  onCancel: () => void;
  onSave: (input: ProductInput) => void;
}) {
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          id: product.id, name: product.name, sku: product.sku, categoryId: product.category_id,
          price: product.price, salePrice: product.sale_price, stock: product.stock, minStock: product.min_stock,
          active: product.active, featured: product.featured, description: product.description,
          ingredientsInfo: product.ingredients_info, usageInfo: product.usage_info,
        }
      : emptyForm(categories)
  );

  return (
    <div className="fixed inset-0 bg-ink/50 z-[80] flex items-center justify-center p-5" onClick={onCancel}>
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[88vh] overflow-y-auto p-6.5" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4.5">{product ? "Edit Product" : "Add Product"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <LabeledInput label="Product name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <LabeledInput label="SKU / Product code" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} required />
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-bark">Category</label>
              <select className="input" value={form.categoryId ?? ""} onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <LabeledInput label="Price (R)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
            <LabeledInput label="Sale price (R, optional)" type="number" value={form.salePrice ?? ""} onChange={(v) => setForm({ ...form, salePrice: v === "" ? null : Number(v) })} />
            <LabeledInput label="Stock quantity" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: Number(v) })} required />
            <LabeledInput label="Minimum stock level" type="number" value={form.minStock} onChange={(v) => setForm({ ...form, minStock: Number(v) })} required />
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-bark">Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-bark">Ingredients / information</label>
              <textarea className="input" rows={2} value={form.ingredientsInfo} onChange={(e) => setForm({ ...form, ingredientsInfo: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-bark">Usage information</label>
              <textarea className="input" rows={2} value={form.usageInfo} onChange={(e) => setForm({ ...form, usageInfo: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded border border-ember-600 text-ember-700 font-bold text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 rounded bg-ember-600 hover:bg-ember-700 disabled:opacity-60 text-white font-bold text-sm">
              {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, type = "text", required,
}: { label: string; value: string | number; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-bold text-bark">{label}</label>
      <input className="input" type={type} value={value} required={required} step={type === "number" ? "0.01" : undefined} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
