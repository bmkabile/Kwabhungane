"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatZAR } from "@/lib/format";
import { placeOrder } from "@/app/checkout/actions";

const BRANCHES = ["Newcastle", "Madadeni", "Nelspruit"];

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFee, total, clear } = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"courier" | "collection">("courier");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayFee = useMemo(
    () => (delivery === "collection" ? 0 : deliveryFee),
    [delivery, deliveryFee]
  );

  if (lines.length === 0) {
    return (
      <section className="py-14">
        <div className="max-w-wrap mx-auto px-7 text-center py-16">
          <div className="text-4xl mb-3">🛒</div>
          <h2>Nothing to check out</h2>
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/shop" className="inline-block mt-3 px-6 py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold">
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const result = await placeOrder({
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      branchName: String(form.get("branch")),
      delivery,
      address: String(form.get("address") ?? ""),
      items: lines.map((l) => ({ productId: l.productId, quantity: l.qty })),
    });

    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong placing your order. Please try again.");
      return;
    }
    clear();
    const name = String(form.get("name"));
    router.push(`/order-confirmation/${result.orderNumber}?name=${encodeURIComponent(name)}`);
  }

  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="flex mb-9">
          <div className="flex-1 text-center py-3 border-b-[3px] border-leaf-700 text-leaf-700 text-sm font-bold">1. Cart</div>
          <div className="flex-1 text-center py-3 border-b-[3px] border-ember-600 text-ink text-sm font-bold">2. Checkout</div>
          <div className="flex-1 text-center py-3 border-b-[3px] border-cream-2 text-muted text-sm font-bold">3. Confirmation</div>
        </div>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div>
            <div className="bg-white border border-cream-2 rounded p-5.5 mb-5">
              <h3 className="text-base mb-3.5">Customer details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name"><input name="name" required placeholder="Your name" className="input" /></Field>
                <Field label="Email"><input name="email" required type="email" placeholder="you@example.com" className="input" /></Field>
                <Field label="Phone"><input name="phone" required placeholder="082 000 0000" className="input" /></Field>
                <Field label="Preferred branch">
                  <select name="branch" className="input">
                    {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className="bg-white border border-cream-2 rounded p-5.5 mb-5">
              <h3 className="text-base mb-3.5">Delivery / Collection</h3>
              <label className={`flex gap-2.5 border rounded p-3.5 items-start cursor-pointer mb-2.5 ${delivery === "courier" ? "border-ember-500 bg-[#FDF6EC]" : "border-cream-2"}`}>
                <input type="radio" checked={delivery === "courier"} onChange={() => setDelivery("courier")} className="mt-0.5" />
                <div><strong className="block text-sm">Courier delivery</strong><span className="text-xs text-muted">2–4 business days · R65, free over R750</span></div>
              </label>
              <label className={`flex gap-2.5 border rounded p-3.5 items-start cursor-pointer ${delivery === "collection" ? "border-ember-500 bg-[#FDF6EC]" : "border-cream-2"}`}>
                <input type="radio" checked={delivery === "collection"} onChange={() => setDelivery("collection")} className="mt-0.5" />
                <div><strong className="block text-sm">Collect from branch</strong><span className="text-xs text-muted">Ready within 1 business day · Free</span></div>
              </label>
              <Field label="Delivery address (if courier)">
                <textarea name="address" rows={3} placeholder="Street, suburb, city, postal code" className="input" />
              </Field>
            </div>

            <div className="bg-white border border-cream-2 rounded p-5.5 mb-5">
              <h3 className="text-base mb-3.5">Payment</h3>
              <p className="text-[13.5px] text-muted mb-3.5">
                Kwa Bhungane does not store card details. Payment is handled securely by a South African
                payment gateway partner (e.g. Yoco, PayFast or Payflex) at checkout.
              </p>
              <div className="flex gap-2.5 border border-ember-500 bg-[#FDF6EC] rounded p-3.5 items-start">
                <input type="radio" checked readOnly className="mt-0.5" />
                <div><strong className="block text-sm">Card / Instant EFT</strong><span className="text-xs text-muted">Redirects to secure payment gateway (demo — no real payment is taken)</span></div>
              </div>
            </div>

            {error && <p className="text-danger text-sm mb-3">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full py-3 rounded bg-ember-600 hover:bg-ember-700 disabled:opacity-60 text-white font-bold">
              {submitting ? "Placing order…" : `Place Order — ${formatZAR(total)}`}
            </button>
          </div>

          <div className="bg-white border border-cream-2 rounded p-6 sticky top-24">
            <h3 className="text-[17px] mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm mb-3"><span>Subtotal</span><span>{formatZAR(subtotal)}</span></div>
            <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span>{displayFee === 0 ? "Free" : formatZAR(displayFee)}</span></div>
            <div className="flex justify-between text-lg font-extrabold border-t border-cream-2 pt-3.5 mt-2.5">
              <span>Total</span><span>{formatZAR(subtotal + displayFee)}</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 mb-1">
      <label className="text-xs font-bold text-bark">{label}</label>
      {children}
    </div>
  );
}
