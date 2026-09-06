import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getBranches, getCategoryMap, getActiveProducts } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, branches, categoryMap, allProducts] = await Promise.all([
    getFeaturedProducts(4),
    getBranches(),
    getCategoryMap(),
    getActiveProducts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden text-cream bg-[radial-gradient(120%_140%_at_15%_0%,#3E2718_0%,#1B120C_55%,#140D08_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(217,123,62,0.35),transparent_45%),radial-gradient(circle_at_95%_75%,rgba(211,162,76,0.18),transparent_50%)]" />
        <div className="relative max-w-wrap mx-auto px-7 py-16 md:py-24 grid md:grid-cols-[1.05fr_0.75fr] gap-12 items-center">
          <div>
            <div className="text-gold-soft font-bold text-[13px] tracking-wide mb-3.5">
              UMTHOLAMPILO WESINTU · THREE BRANCHES, ONE HERITAGE
            </div>
            <h1 className="text-cream text-4xl md:text-5xl max-w-[11.5ch] mb-4">
              Indigenous healthcare, prepared with care and carried into today.
            </h1>
            <p className="text-cream-2 text-[17px] max-w-[46ch] mb-7">
              Kwa Bhungane brings traditional remedies and indigenous knowledge to your door —
              browse our products online, or visit us in Newcastle, Madadeni and Nelspruit.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/shop" className="px-6 py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold">
                Shop Products
              </Link>
              <span className="px-6 py-3 rounded border border-white/40 text-cream font-bold opacity-80 cursor-default">
                Book a Consultation — Coming Soon
              </span>
            </div>
            <div className="flex gap-8 flex-wrap mt-11">
              <div><strong className="block font-serif text-2xl text-gold-soft">3</strong><span className="text-xs text-cream-2">Branches across SA</span></div>
              <div><strong className="block font-serif text-2xl text-gold-soft">{allProducts.length}+</strong><span className="text-xs text-cream-2">Products online</span></div>
              <div><strong className="block font-serif text-2xl text-gold-soft">1,200+</strong><span className="text-xs text-cream-2">Customers served</span></div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image src="/logo.jpg" alt="Kwa Bhungane emblem" width={340} height={340} className="rounded-full w-full max-w-[340px] shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-wrap mx-auto px-7">
          <div className="max-w-xl mb-10">
            <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Why Kwa Bhungane</div>
            <h2 className="text-3xl mb-2">Rooted in tradition, built for how you live today</h2>
            <p className="text-muted">Everything we offer is grounded in indigenous knowledge, prepared thoughtfully and made easier to access.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              ["🌳", "Indigenous knowledge", "Remedies and practices passed down through generations across our branches."],
              ["🚚", "Delivered to your door", "Order online and choose courier delivery or collect from your nearest branch."],
              ["🏠", "Three branches, one standard", "Newcastle, Madadeni and Nelspruit — consistent products and service everywhere."],
            ].map(([icon, title, body]) => (
              <div key={title} className="bg-white border border-cream-2 rounded p-6">
                <div className="w-11 h-11 rounded-full bg-leaf-soft text-leaf-700 flex items-center justify-center text-xl mb-4">{icon}</div>
                <h4 className="text-[17px] mb-2">{title}</h4>
                <p className="text-sm text-muted m-0">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-2 py-16">
        <div className="max-w-wrap mx-auto px-7">
          <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
            <div>
              <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Featured</div>
              <h2 className="mb-0">Popular products</h2>
            </div>
            <Link href="/shop" className="px-4 py-2 text-sm rounded border border-ember-600 text-ember-700 font-bold hover:bg-ember-600 hover:text-white">
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} categoryName={p.category_id ? categoryMap[p.category_id] : undefined} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-wrap mx-auto px-7">
          <div className="mb-8">
            <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Visit us</div>
            <h2>Find your nearest branch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {branches.map((b) => (
              <div key={b.id} className="bg-white border border-cream-2 rounded overflow-hidden">
                <div className="bg-bark text-cream px-5 py-4">
                  <div className="text-[11px] uppercase tracking-wide text-gold-soft font-bold mb-1">{b.tag}</div>
                  <h3 className="text-white text-xl m-0">{b.name}</h3>
                </div>
                <div className="px-5 py-4 text-sm">
                  <p className="mb-2">📍 {b.address}</p>
                  <p className="mb-2">📞 {b.phone}</p>
                  <p className="mb-0">🕒 {b.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
