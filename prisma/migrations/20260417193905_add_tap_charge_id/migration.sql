-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tapChargeId" TEXT;

-- RenameIndex
ALTER INDEX "idx_categories_sort_order" RENAME TO "categories_sortOrder_idx";

-- RenameIndex
ALTER INDEX "idx_order_items_order" RENAME TO "order_items_orderId_idx";

-- RenameIndex
ALTER INDEX "idx_order_items_product" RENAME TO "order_items_productId_idx";

-- RenameIndex
ALTER INDEX "idx_order_items_variant" RENAME TO "order_items_variantId_idx";

-- RenameIndex
ALTER INDEX "idx_orders_created_at" RENAME TO "orders_createdAt_idx";

-- RenameIndex
ALTER INDEX "idx_orders_status_created_at" RENAME TO "orders_status_createdAt_idx";

-- RenameIndex
ALTER INDEX "idx_product_categories_category_product" RENAME TO "product_categories_categoryId_productId_idx";

-- RenameIndex
ALTER INDEX "idx_product_images_product_sort" RENAME TO "product_images_productId_sortOrder_idx";

-- RenameIndex
ALTER INDEX "idx_product_variants_product_created" RENAME TO "product_variants_productId_createdAt_idx";

-- RenameIndex
ALTER INDEX "idx_product_variants_product_stock" RENAME TO "product_variants_productId_stock_idx";

-- RenameIndex
ALTER INDEX "idx_products_created_at" RENAME TO "products_createdAt_idx";

-- RenameIndex
ALTER INDEX "idx_products_is_published_created_at" RENAME TO "products_isPublished_createdAt_idx";

-- RenameIndex
ALTER INDEX "idx_products_is_published_is_best_seller" RENAME TO "products_isPublished_isBestSeller_idx";

-- RenameIndex
ALTER INDEX "idx_role_permissions_permission" RENAME TO "role_permissions_permissionId_idx";
