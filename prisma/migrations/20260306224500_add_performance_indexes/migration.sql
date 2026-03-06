CREATE INDEX IF NOT EXISTS "idx_categories_sort_order" ON "categories" ("sortOrder");

CREATE INDEX IF NOT EXISTS "idx_products_is_published_created_at" ON "products" ("isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_products_is_published_is_best_seller" ON "products" ("isPublished", "isBestSeller");
CREATE INDEX IF NOT EXISTS "idx_products_created_at" ON "products" ("createdAt");

CREATE INDEX IF NOT EXISTS "idx_product_categories_category_product" ON "product_categories" ("categoryId", "productId");
CREATE INDEX IF NOT EXISTS "idx_product_images_product_sort" ON "product_images" ("productId", "sortOrder");
CREATE INDEX IF NOT EXISTS "idx_product_variants_product_created" ON "product_variants" ("productId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_product_variants_product_stock" ON "product_variants" ("productId", "stock");

CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "orders" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_orders_status_created_at" ON "orders" ("status", "createdAt");

CREATE INDEX IF NOT EXISTS "idx_order_items_order" ON "order_items" ("orderId");
CREATE INDEX IF NOT EXISTS "idx_order_items_product" ON "order_items" ("productId");
CREATE INDEX IF NOT EXISTS "idx_order_items_variant" ON "order_items" ("variantId");

CREATE INDEX IF NOT EXISTS "idx_role_permissions_permission" ON "role_permissions" ("permissionId");
