import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getCategoryMap, getActiveProducts } from "@/lib/data";
import { ProductCard, gradientFor, stockBadge } from "@/components/site/ProductCard";
import { formatZAR } from "@/lib/format";
import { AddToCartButton } from "@/components/site/AddToCartButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} — Kwa Bhungane` : "Product — Kwa Bhungane" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [categoryMap, allProducts] = await Promise.all([getCategoryMap(), getActiveProducts()]);
  const categoryName = product.category_id ? categoryMap[product.category_id] : undefined;
  const related = allProducts.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
  const badge = stockBadge(product);

  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="text-[13px] text-muted mb-5">
          <Link href="/shop">Shop</Link> / {categoryName ?? ""} / {product.name}
        </div>
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-12">
          <div
            className="relative aspect-square rounded-lg flex items-center justify-center text-white text-2xl font-serif px-4"
            style={{ background: gradientFor(product.id) }}
          >
            {product.sale_price && (
              <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full">Sale</span>
            )}
            <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full ${badge.cls}`}>{badge.label}</span>
            <span>{product.name}</span>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-ember-600 font-bold">{categoryName}</div>
            <h1 className="text-3xl my-1.5">{product.name}</h1>
            <div className="text-2xl font-extrabold mb-4">
              {product.sale_price ? (
                <>
                  <span className="line-through text-muted text-base mr-2 font-medium">{formatZAR(product.price)}</span>
                  {formatZAR(product.sale_price)}
                </>
              ) : (
                formatZAR(product.price)
              )}
            </div>
            <p>{product.description}</p>
            <p className="text-[13.5px] text-muted">
              SKU: {product.sku} &nbsp;·&nbsp; Available: {product.stock} unit{product.stock === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-3 my-5">
              <AddToCartButton product={product} />
            </div>
            <div className="bg-white border border-cream-2 rounded p-4.5">
              <h4 className="text-sm mb-2">Ingredients / Information</h4>
              <p className="text-[13.5px] text-muted mb-3.5">{product.ingredients_info}</p>
              <h4 className="text-sm mb-2">Usage Information</h4>
              <p className="text-[13.5px] text-muted m-0">{product.usage_info}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl mb-5">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} categoryName={p.category_id ? categoryMap[p.category_id] : undefined} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
