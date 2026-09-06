"use client";

import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/database.types";

export function AddToCartButton({ product, qty = 1 }: { product: Product; qty?: number }) {
  const { add } = useCart();
  const disabled = product.stock <= 0;

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.sale_price ?? product.price,
            stock: product.stock,
          },
          qty
        );
      }}
      title="Add to cart"
      className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center text-lg hover:bg-ember-600 disabled:bg-cream-2 disabled:text-muted disabled:cursor-not-allowed"
    >
      +
    </button>
  );
}
