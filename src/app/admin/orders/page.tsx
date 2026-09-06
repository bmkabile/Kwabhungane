import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/admin/Topbar";
import { OrdersTable } from "@/app/admin/orders/OrdersTable";
import type { Order, OrderItem } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), branches(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <Topbar title="Orders" subtitle="Track and update customer orders" />
      <div style={{ padding: "28px 30px 60px" }}>
        <OrdersTable orders={(orders ?? []) as unknown as (Order & { order_items: OrderItem[]; branches: { name: string } | null })[]} />
      </div>
    </>
  );
}
