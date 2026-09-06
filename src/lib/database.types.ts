// Hand-written types mirroring supabase/migrations/0001_init.sql.
// Regenerate with `supabase gen types typescript` once the schema
// evolves, and this file can be replaced wholesale.

export type OrderStatus =
  | "New" | "Paid" | "Processing" | "Ready" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Pending" | "Paid" | "Refunded";
export type DeliveryMethod = "courier" | "collection";

export type AdminRow = { user_id: string; created_at: string };

export type BranchRow = {
  id: string; name: string; tag: string; address: string; phone: string;
  hours: string; manager: string; is_head_office: boolean; created_at: string;
};

export type CategoryRow = { id: string; name: string; slug: string; sort_order: number };

export type ProductRow = {
  id: string; sku: string; slug: string; name: string; category_id: string | null;
  description: string; ingredients_info: string; usage_info: string;
  price: number; sale_price: number | null; image_url: string | null;
  stock: number; min_stock: number; active: boolean; featured: boolean;
  created_at: string; updated_at: string;
};

export type BranchStockRow = { product_id: string; branch_id: string; qty: number };

export type CustomerRow = {
  id: string; auth_user_id: string | null; name: string; email: string;
  phone: string; status: "Active" | "Inactive"; created_at: string;
};

export type OrderRow = {
  id: string; order_number: string; customer_id: string | null;
  customer_name: string; customer_email: string; customer_phone: string;
  branch_id: string | null; delivery_method: DeliveryMethod; delivery_address: string | null;
  status: OrderStatus; payment_status: PaymentStatus; payment_provider: string | null;
  subtotal: number; delivery_fee: number; total: number; created_at: string;
};

export type OrderItemRow = {
  id: string; order_id: string; product_id: string | null;
  product_name: string; unit_price: number; quantity: number;
};

export type ContactMessageRow = {
  id: string; name: string; email: string; subject: string | null;
  message: string; created_at: string; handled: boolean;
};

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: AdminRow;
        Insert: Partial<AdminRow> & { user_id: string };
        Update: Partial<AdminRow>;
        Relationships: [];
      };
      branches: {
        Row: BranchRow;
        Insert: Partial<BranchRow> & { name: string };
        Update: Partial<BranchRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & { name: string; slug: string };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & { sku: string; slug: string; name: string; price: number };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      branch_stock: {
        Row: BranchStockRow;
        Insert: Partial<BranchStockRow> & { product_id: string; branch_id: string };
        Update: Partial<BranchStockRow>;
        Relationships: [];
      };
      customers: {
        Row: CustomerRow;
        Insert: Partial<CustomerRow> & { name: string; email: string };
        Update: Partial<CustomerRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> & {
          order_number: string; customer_name: string; customer_email: string; delivery_method: DeliveryMethod;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Partial<OrderItemRow> & {
          order_id: string; product_name: string; unit_price: number; quantity: number;
        };
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Partial<ContactMessageRow> & { name: string; email: string; message: string };
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      next_order_number: { Args: Record<PropertyKey, never>; Returns: string };
      create_order: {
        Args: {
          p_customer_name: string;
          p_customer_email: string;
          p_customer_phone: string;
          p_branch_id: string | null;
          p_delivery_method: DeliveryMethod;
          p_delivery_address: string | null;
          p_items: { product_id: string; quantity: number }[];
        };
        Returns: { order_number: string; order_id: string; total: number }[];
      };
    };
  };
};

export type Branch = BranchRow;
export type Category = CategoryRow;
export type Product = ProductRow;
export type Customer = CustomerRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type ContactMessage = ContactMessageRow;
