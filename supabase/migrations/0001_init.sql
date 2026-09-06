-- ============================================================
-- Kwa Bhungane — Phase 1 schema
-- Website + Online Shop + Admin Dashboard
-- Designed so branch-level inventory, consultations, and a
-- knowledge centre can be added later without restructuring.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ADMINS ----------
-- Users listed here get admin access to the dashboard.
-- Add rows manually after creating the user in Supabase Auth:
--   insert into public.admins (user_id) values ('<auth-user-uuid>');
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- BRANCHES ----------
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tag text not null default 'Branch',
  address text not null default '',
  phone text not null default '',
  hours text not null default '',
  manager text not null default '',
  is_head_office boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories (id) on delete set null,
  description text not null default '',
  ingredients_info text not null default '',
  usage_info text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
  image_url text,
  stock int not null default 0 check (stock >= 0),
  min_stock int not null default 5 check (min_stock >= 0),
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);

-- ---------- BRANCH STOCK (phase 2 — foundation laid now) ----------
-- Not yet used by the UI. Lets per-branch inventory switch on later
-- without a schema change: sum(branch_stock.qty) can replace
-- products.stock once branch-level tracking goes live.
create table if not exists public.branch_stock (
  product_id uuid not null references public.products (id) on delete cascade,
  branch_id uuid not null references public.branches (id) on delete cascade,
  qty int not null default 0 check (qty >= 0),
  primary key (product_id, branch_id)
);

-- ---------- CUSTOMERS ----------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  phone text not null default '',
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now()
);
create unique index if not exists customers_email_idx on public.customers (email);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  branch_id uuid references public.branches (id) on delete set null,
  delivery_method text not null check (delivery_method in ('courier', 'collection')),
  delivery_address text,
  status text not null default 'New'
    check (status in ('New','Paid','Processing','Ready','Shipped','Delivered','Cancelled','Refunded')),
  payment_status text not null default 'Pending' check (payment_status in ('Pending','Paid','Refunded')),
  payment_provider text,
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null,
  quantity int not null check (quantity > 0)
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- CONTACT MESSAGES ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now(),
  handled boolean not null default false
);

-- ---------- ORDER NUMBER SEQUENCE ----------
create sequence if not exists public.order_number_seq start 10045;
create or replace function public.next_order_number()
returns text
language sql
as $$
  select 'KB-' || nextval('public.order_number_seq')::text;
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.branch_stock enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins enable row level security;

-- Public (anon + authenticated) can read active catalogue data
create policy "public read branches" on public.branches for select using (true);
create policy "public read categories" on public.categories for select using (true);
create policy "public read active products" on public.products for select using (active = true or public.is_admin());

-- Admins have full read/write on everything
create policy "admin all branches" on public.branches for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all branch_stock" on public.branch_stock for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read customers" on public.customers for select using (public.is_admin());
create policy "admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read orders" on public.orders for select using (public.is_admin());
create policy "admin update orders" on public.orders for update using (public.is_admin());
create policy "admin read order_items" on public.order_items for select using (public.is_admin());
create policy "admin read contact_messages" on public.contact_messages for select using (public.is_admin());
create policy "admin update contact_messages" on public.contact_messages for update using (public.is_admin());
create policy "self read admins" on public.admins for select using (auth.uid() = user_id or public.is_admin());

-- Checkout: anyone (including anonymous shoppers) may create an order
-- and its line items. All order creation is handled server-side via a
-- Server Action using the anon key, never trusting client-set totals
-- beyond what the server itself computed from current product prices.
create policy "anyone can create customer record" on public.customers for insert with check (true);
create policy "anyone can create orders" on public.orders for insert with check (true);
create policy "anyone can create order_items" on public.order_items for insert with check (true);
create policy "anyone can submit contact message" on public.contact_messages for insert with check (true);

-- ============================================================
-- SEED DATA — matches the Phase 1 prototype content
-- ============================================================
insert into public.branches (name, tag, address, phone, hours, manager, is_head_office) values
  ('Newcastle', 'Head Office', '12 Murchison Street, Newcastle, 2940', '034 312 0000', 'Mon-Fri 08:00-17:00, Sat 08:00-13:00', 'T. Bhungane', true),
  ('Madadeni', 'Branch', 'Section 3, Madadeni, 2951', '034 902 1111', 'Mon-Fri 08:00-17:00, Sat 08:00-13:00', 'N. Khumalo', false),
  ('Nelspruit', 'Branch', '45 Ferreira Street, Nelspruit, 1200', '013 752 2222', 'Mon-Fri 08:00-17:00, Sat 08:00-13:00', 'S. Mahlangu', false)
on conflict do nothing;

insert into public.categories (name, slug, sort_order) values
  ('Imbiza & Tonics', 'imbiza-tonics', 1),
  ('Herbal Teas', 'herbal-teas', 2),
  ('Ceremonial Herbs', 'ceremonial-herbs', 3),
  ('Balms & Skincare', 'balms-skincare', 4)
on conflict do nothing;

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-IY-100','imbiza-yokopha','Imbiza Yokopha', (select id from public.categories where slug='imbiza-tonics'),
  'A traditional cleansing tonic prepared using indigenous knowledge passed down through generations at Kwa Bhungane.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane. Store in a cool, dry place away from direct sunlight.',
  'Placeholder usage guidance - to be confirmed by a Kwa Bhungane practitioner before publishing.',
  185, null, 8, 10, true, true
where not exists (select 1 from public.products where sku='KB-IY-100');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-UO-250','uthi-oluhlanzayo','Uthi Oluhlanzayo', (select id from public.categories where slug='imbiza-tonics'),
  'A purifying herbal remedy, blended in small batches following methods practiced across the three Kwa Bhungane branches.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane.',
  'Placeholder usage guidance - to be confirmed before publishing.',
  150, null, 34, 10, true, true
where not exists (select 1 from public.products where sku='KB-UO-250');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-UT-80','umhlonyane-tea','Umhlonyane Tea', (select id from public.categories where slug='herbal-teas'),
  'A dried herbal tea blend, traditionally steeped and shared as part of everyday wellness routines.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane.',
  'Steep in hot water. Placeholder usage guidance.',
  95, null, 0, 5, true, false
where not exists (select 1 from public.products where sku='KB-UT-80');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-IW-120','isicholo-wellness-blend','Isicholo Wellness Blend', (select id from public.categories where slug='herbal-teas'),
  'A gentle daily blend, formulated to support general wellbeing as part of a balanced lifestyle.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane.',
  'Placeholder usage guidance - to be confirmed before publishing.',
  120, 99, 75, 15, true, true
where not exists (select 1 from public.products where sku='KB-IW-120');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-IM-40','imphepho-bundle','Imphepho Bundle', (select id from public.categories where slug='ceremonial-herbs'),
  'Sun-dried Imphepho, gathered and bundled for ceremonial and everyday use.',
  'Sold as a natural, unprocessed bundle. Placeholder details - to be supplied by Kwa Bhungane.',
  'Placeholder usage guidance.',
  60, null, 50, 10, true, false
where not exists (select 1 from public.products where sku='KB-IM-40');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-UB-90','umsuzwane-balm','Umsuzwane Balm', (select id from public.categories where slug='balms-skincare'),
  'A soothing topical balm, prepared with indigenous plant knowledge for everyday skin care.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane.',
  'Apply as directed. Placeholder usage guidance.',
  140, null, 20, 8, true, false
where not exists (select 1 from public.products where sku='KB-UB-90');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-UP-60','ubulawu-ritual-powder','Ubulawu Ritual Powder', (select id from public.categories where slug='ceremonial-herbs'),
  'A traditional ritual powder, prepared according to indigenous customs practiced at Kwa Bhungane.',
  'Placeholder details - to be supplied by Kwa Bhungane.',
  'Placeholder usage guidance - to be confirmed before publishing.',
  110, null, 5, 10, true, false
where not exists (select 1 from public.products where sku='KB-UP-60');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-IC-70','icishamlilo-tea','Icishamlilo Tea', (select id from public.categories where slug='herbal-teas'),
  'A calming herbal tea, traditionally prepared to support everyday balance and rest.',
  'Placeholder ingredient list - to be supplied by Kwa Bhungane.',
  'Steep in hot water. Placeholder usage guidance.',
  130, null, 40, 10, true, true
where not exists (select 1 from public.products where sku='KB-IC-70');

insert into public.products (sku, slug, name, category_id, description, ingredients_info, usage_info, price, sale_price, stock, min_stock, active, featured)
select 'KB-AB-150','amanzi-bath-soak','Amanzi Bath Soak', (select id from public.categories where slug='balms-skincare'),
  'A fragrant herbal bath soak, blended for relaxation and everyday self-care rituals.',
  'Placeholder details - to be supplied by Kwa Bhungane.',
  'Add to warm bath water. Placeholder usage guidance.',
  120, null, 3, 10, true, false
where not exists (select 1 from public.products where sku='KB-AB-150');

-- ============================================================
-- ORDER CREATION (atomic, server-side only)
-- Recomputes prices and validates stock from the database itself,
-- never trusting client-submitted totals. Runs as a single
-- transaction: either the whole order is placed and stock is
-- decremented, or nothing happens.
-- ============================================================
create or replace function public.create_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_branch_id uuid,
  p_delivery_method text,
  p_delivery_address text,
  p_items jsonb -- [{ "product_id": "...", "quantity": 2 }, ...]
)
returns table (order_number text, order_id uuid, total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_order_number text;
  v_customer_id uuid;
  v_subtotal numeric := 0;
  v_delivery_fee numeric := 0;
  v_total numeric := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
begin
  if p_delivery_method not in ('courier', 'collection') then
    raise exception 'Invalid delivery method';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cannot place an order with no items';
  end if;

  insert into public.customers (name, email, phone)
  values (p_customer_name, p_customer_email, p_customer_phone)
  on conflict (email) do update set name = excluded.name, phone = excluded.phone
  returning id into v_customer_id;

  -- Lock the product rows for the duration of this transaction so two
  -- simultaneous checkouts can't both oversell the last unit.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::int;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and active = true
      for update;

    if not found then
      raise exception 'Product not found or no longer available';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for % (only % left)', v_product.name, v_product.stock;
    end if;

    v_subtotal := v_subtotal + coalesce(v_product.sale_price, v_product.price) * v_qty;
  end loop;

  if p_delivery_method = 'courier' and v_subtotal < 750 then
    v_delivery_fee := 65;
  end if;
  v_total := v_subtotal + v_delivery_fee;
  v_order_number := public.next_order_number();

  insert into public.orders (
    id, order_number, customer_id, customer_name, customer_email, customer_phone,
    branch_id, delivery_method, delivery_address, status, payment_status, subtotal, delivery_fee, total
  ) values (
    v_order_id, v_order_number, v_customer_id, p_customer_name, p_customer_email, p_customer_phone,
    p_branch_id, p_delivery_method, p_delivery_address, 'New', 'Pending', v_subtotal, v_delivery_fee, v_total
  );

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::int;
    select * into v_product from public.products where id = (v_item ->> 'product_id')::uuid;

    insert into public.order_items (order_id, product_id, product_name, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, coalesce(v_product.sale_price, v_product.price), v_qty);

    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;

  return query select v_order_number, v_order_id, v_total;
end;
$$;

grant execute on function public.create_order to anon, authenticated;
