import type { Metadata } from "next";
import { getActiveProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { ShopFilters } from "@/app/shop/ShopFilters";

export const metadata: Metadata = { title: "Shop — Kwa Bhungane" };
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const q = (searchParams.q ?? "").toLowerCase().trim();
  const activeCategory = searchParams.category ?? "All";

  const filtered = products.filter((p) => {
    const catName = p.category_id ? categoryMap[p.category_id] : "";
    const matchesCategory = activeCategory === "All" || catName === activeCategory;
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || catName.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="max-w-xl mb-8">
          <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Shop</div>
          <h2 className="text-3xl">All products</h2>
          <p className="text-muted">Browse the full Kwa Bhungane catalogue. Prices and stock availability update in real time.</p>
        </div>

        <ShopFilters categories={categories.map((c) => c.name)} activeCategory={activeCategory} initialQuery={searchParams.q ?? ""} />

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} categoryName={p.category_id ? categoryMap[p.category_id] : undefined} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
