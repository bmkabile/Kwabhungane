import Link from "next/link";
import type { Product } from "@/lib/database.types";
import { formatZAR } from "@/lib/format";
import { AddToCartButton } from "@/components/site/AddToCartButton";

const GRADIENTS = [
  "linear-gradient(135deg,#B65A26,#8F431C)",
  "linear-gradient(135deg,#557242,#3E5A32)",
  "linear-gradient(135deg,#D3A24C,#B6811F)",
  "linear-gradient(135deg,#8F431C,#3E1D0E)",
  "linear-gradient(135deg,#6B7F55,#3E5A32)",
  "linear-gradient(135deg,#C1702F,#732E12)",
];

function gradientFor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

function stockBadge(product: Product) {
  if (product.stock <= 0) return { label: "Out of stock", cls: "bg-danger-soft text-danger" };
  if (product.stock <= product.min_stock) return { label: "Low stock", cls: "bg-warn-soft text-warn" };
  return { label: "In stock", cls: "bg-ok-soft text-ok" };
}

export function ProductCard({ product, categoryName }: { product: Product; categoryName?: string }) {
  const badge = stockBadge(product);
  return (
    <div className="bg-white border border-cream-2 rounded overflow-hidden flex flex-col transition hover:shadow-lg hover:-translate-y-0.5">
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square">
        <div
          className="w-full h-full flex items-center justify-center text-center px-3.5 font-serif text-white text-sm"
          style={{ background: gradientFor(product.id) }}
        >
          {product.sale_price && (
            <span className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Sale
            </span>
          )}
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
          <span className="relative z-10">{product.name}</span>
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="text-[11px] uppercase tracking-wide text-ember-600 font-bold">
          {categoryName ?? ""}
        </div>
        <Link href={`/shop/${product.slug}`}>
          <div className="font-serif text-base text-ink">{product.name}</div>
        </Link>
        <p className="text-[13px] text-muted flex-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="font-extrabold text-ink">
            {product.sale_price ? (
              <>
                <span className="line-through text-muted font-medium text-xs mr-1">{formatZAR(product.price)}</span>
                {formatZAR(product.sale_price)}
              </>
            ) : (
              formatZAR(product.price)
            )}
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

export { gradientFor, stockBadge };
