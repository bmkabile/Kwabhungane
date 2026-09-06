import { Topbar } from "@/components/admin/Topbar";

const now = [
  "Public website — home, about, shop, product pages, branches, contact",
  "Online shop — catalogue, cart, checkout, orders, payment-gateway ready",
  "Admin dashboard — products, inventory, orders, customers, branches, reports",
];
const next: [string, string][] = [
  ["Mobile app", "Native or PWA companion app, reusing the same product & order data."],
  ["Consultation booking", "Turns the 'Book a Consultation' button live with real scheduling."],
  ["Knowledge centre", "Educational articles and indigenous-knowledge content hub."],
  ["Analytics expansion", "Deeper business intelligence, forecasting and branch comparisons."],
  ["Social integrations", "Auto-posting, social login and social commerce features."],
  ["Branch-level inventory", "Per-branch stock counts and transfers (foundation already in place)."],
  ["Google Maps integration", "Live directions and embedded maps on the Branches page."],
  ["Payment gateway webhook", "Wire Yoco/PayFast/Payflex to confirm payment_status automatically."],
];

export default function AdminRoadmapPage() {
  return (
    <>
      <Topbar title="What's Next" subtitle="Planned for future phases" />
      <div style={{ padding: "28px 30px 60px" }}>
        <div className="bg-white border border-[#EBE1CC] rounded p-5.5 mb-5">
          <h3 className="text-base mb-4">Phase 1 — building now</h3>
          {now.map((t) => (
            <div key={t} className="flex gap-3 items-start py-2.5 border-b border-[#F1E9D8] last:border-0">
              <div className="w-2.5 h-2.5 rounded-full bg-ember-600 mt-1.5 shrink-0" />
              <b className="text-[13.5px]">{t}</b>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#EBE1CC] rounded p-5.5">
          <h3 className="text-base mb-1.5">Designed for, added later</h3>
          <p className="text-[13px] text-muted mb-2">The system is built so none of this requires rebuilding the foundation.</p>
          {next.map(([t, d]) => (
            <div key={t} className="flex gap-3 items-start py-2.5 border-b border-[#F1E9D8] last:border-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D8CFC0] mt-1.5 shrink-0" />
              <div><b className="block text-[13.5px]">{t}</b><span className="text-[12.5px] text-muted">{d}</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
