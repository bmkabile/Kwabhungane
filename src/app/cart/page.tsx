"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatZAR } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, deliveryFee, total, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <section className="py-14">
        <div className="max-w-wrap mx-auto px-7 text-center py-16">
          <div className="text-4xl mb-3">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="text-muted">Browse the shop to find your first order.</p>
          <Link href="/shop" className="inline-block mt-3 px-6 py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold">
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7">
        <div className="mb-8">
          <div className="text-ember-600 font-bold text-xs tracking-wide uppercase mb-2.5">Cart</div>
          <h2 className="text-3xl">Your cart</h2>
        </div>
        <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div>
            {lines.map((l) => (
              <div key={l.productId} className="flex gap-4 items-center py-4 border-b border-cream-2">
                <div className="w-16 h-16 rounded bg-cream-2 shrink-0" />
                <div className="flex-1">
                  <div className="font-serif text-[15.5px] text-ink">{l.name}</div>
                  <div className="text-xs text-muted">{formatZAR(l.price)} each</div>
                  <button onClick={() => remove(l.productId)} className="text-danger text-xs font-semibold mt-1">
                    Remove
                  </button>
                </div>
                <div className="flex items-center border border-cream-2 rounded overflow-hidden">
                  <button onClick={() => setQty(l.productId, l.qty - 1)} className="w-8 h-8 hover:bg-cream-2">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                  <button onClick={() => setQty(l.productId, l.qty + 1)} className="w-8 h-8 hover:bg-cream-2">+</button>
                </div>
                <div className="w-20 text-right font-bold">{formatZAR(l.price * l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-cream-2 rounded p-6 sticky top-24">
            <h3 className="text-[17px] mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm mb-3"><span>Subtotal</span><span>{formatZAR(subtotal)}</span></div>
            <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : formatZAR(deliveryFee)}</span></div>
            {deliveryFee > 0 && <p className="text-xs text-muted mb-2">Free delivery on orders over R750</p>}
            <div className="flex justify-between text-lg font-extrabold border-t border-cream-2 pt-3.5 mt-1.5">
              <span>Total</span><span>{formatZAR(total)}</span>
            </div>
            <Link href="/checkout" className="block text-center mt-3 w-full py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
