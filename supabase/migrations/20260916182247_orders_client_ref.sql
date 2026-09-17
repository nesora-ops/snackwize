-- A short code minted in the browser and printed in the WhatsApp message, so
-- Nupur can match an incoming chat to its order row. The server order id can't
-- serve this: the row is written with a non-blocking keepalive POST while the
-- browser is already navigating to wa.me, so the client never sees that id.
alter table orders add column if not exists client_ref text;
create index if not exists orders_client_ref_idx on orders (client_ref);
