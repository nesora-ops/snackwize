ALTER TABLE products DROP CONSTRAINT IF EXISTS products_delivery_type_check;
UPDATE products SET delivery_type = 'domestic' WHERE delivery_type = 'local';
ALTER TABLE products ADD CONSTRAINT products_delivery_type_check CHECK (delivery_type IN ('domestic', 'hyperlocal'));
