import Link from "next/link";

// Order confirmation intentionally does NOT re-query the orders table:
// anonymous customers only have INSERT rights on orders (see RLS
// policies in supabase/migrations/0001_init.sql), and order numbers
// are sequential, so allowing public SELECT by order_number would let
// anyone browse other customers' orders. The confirmation details are
// passed straight through from the checkout step instead.

export default function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { orderNumber: string };
  searchParams: { name?: string };
}) {
  const name = searchParams.name ? decodeURIComponent(searchParams.name) : undefined;

  return (
    <section className="py-14">
      <div className="max-w-wrap mx-auto px-7 text-center py-16">
        <div className="text-4xl mb-3">✅</div>
        <h2>Order confirmed!</h2>
        <p>
          Thank you{name ? `, ${name}` : ""}. Your order <strong>{params.orderNumber}</strong> has been received
          and is being prepared.
        </p>
        <p className="text-[13.5px] text-muted">
          You&rsquo;ll see this order move through <em>New → Processing → Shipped → Delivered</em> as our team
          works on it.
        </p>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          <Link href="/shop" className="px-6 py-3 rounded bg-ember-600 hover:bg-ember-700 text-white font-bold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
