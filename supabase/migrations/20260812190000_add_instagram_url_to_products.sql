-- Per-product link to the Instagram reel behind it. Rendered as a discreet
-- glyph on /order and as a "View on Instagram" button on /menu. Null for
-- products that have no post yet.
alter table products add column if not exists instagram_url text;
