-- Takes a product off every customer-facing surface without deleting it.
-- Deleting would cascade away its inventory_logs and stock_movements, and a
-- retired product may come back. Past orders snapshot their own line items,
-- so hiding never touches order history.
alter table products add column if not exists hidden boolean not null default false;
