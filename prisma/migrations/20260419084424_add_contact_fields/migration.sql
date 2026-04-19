-- AlterTable
ALTER TABLE "store_settings" ADD COLUMN     "addressAr" TEXT NOT NULL DEFAULT 'الدوحة، قطر',
ADD COLUMN     "addressEn" TEXT NOT NULL DEFAULT 'Doha, Qatar',
ADD COLUMN     "contactEmail" TEXT NOT NULL DEFAULT 'info@shop-lamees.com';
