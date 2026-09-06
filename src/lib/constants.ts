import type { OrderStatus } from "@/lib/database.types";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "New", "Paid", "Processing", "Ready", "Shipped", "Delivered", "Cancelled", "Refunded",
];

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Paid: "bg-ok-soft text-ok",
  Processing: "bg-warn-soft text-warn",
  Ready: "bg-warn-soft text-warn",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-ok-soft text-ok",
  Cancelled: "bg-danger-soft text-danger",
  Refunded: "bg-cream-2 text-bark",
};

export const FREE_DELIVERY_THRESHOLD = 750;
export const COURIER_FEE = 65;

export const SITE_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/branches", label: "Branches" },
  { href: "/contact", label: "Contact" },
];

export const ADMIN_NAV = [
  { section: "Overview", items: [{ href: "/admin/dashboard", label: "Dashboard" }] },
  {
    section: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products" },
      { href: "/admin/inventory", label: "Inventory" },
    ],
  },
  {
    section: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" },
    ],
  },
  {
    section: "Business",
    items: [
      { href: "/admin/branches", label: "Branches" },
      { href: "/admin/reports", label: "Reports & Analytics" },
      { href: "/admin/roadmap", label: "What's Next" },
    ],
  },
];
