import type { Metadata } from "next";
import { getBranches } from "@/lib/data";

export const metadata: Metadata = { title: "Branches — Kwa Bhungane" };
export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const branches = await getBranches();
  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="max-w-xl mb-10">
          <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Our Branches</div>
          <h2 className="text-3xl">Visit Kwa Bhungane</h2>
          <p className="text-muted">Three branches, one standard of care. Google Maps integration and live directions are planned for a future release.</p>
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
                <p className="mb-3">🕒 {b.hours}</p>
                <div className="h-[110px] rounded bg-[repeating-linear-gradient(45deg,#F3E9D6,#F3E9D6_10px,#fff_10px,#fff_20px)] flex items-center justify-center text-xs text-muted">
                  Map integration — coming soon
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
