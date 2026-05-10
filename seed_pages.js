const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contentAr = `سياسة الاستبدال والاسترجاع

١. إلغاء الطلب: في حال كان الطلب في مرحلة "قيد التنفيذ"، لا يمكن إلغاؤه.
٢. الطلبات المخصصة: إذا تم طلب تعديلات خاصة على القطعة، مثل تغيير المقاسات أو الموديل أو إضافة تعديلات خارجية بناءً على طلب العميل، فلا يمكن استبدال القطعة أو استرجاعها.
٣. المنتجات المصنوعة حسب الطلب: العبايات التي يتم تفصيلها وفقًا للطلب تعتبر منتجات مخصصة وليست جاهزة للاستخدام الفوري.

الاسترجاع: يمكن قبول الاسترجاع فقط في الحالات التالية:

في حال وصول المنتج تالفًا.
في حال حدوث خطأ في الشحن.
إذا كان المنتج مخالفًا للحجم المحدد من قبل العميل.`;

  const contentEn = `Return and Exchange Policy

Order Cancellation: Once the order is in the "Processing" stage, it cannot be cancelled.
Custom Orders: If the item has been customized according to the customer's request—such as modifications in size, model, or adding any external alterations—it cannot be exchanged or returned.
Made-to-Order Products: Abayas made to order are considered customized products and are not ready-made for immediate use.

Return Conditions: Returns will only be accepted in the following cases:

If the product arrives damaged.
In case of shipping errors.
If the product does not match the size specified by the customer.`;

  const pages = [
    { titleAr: 'من نحن', titleEn: 'About Us', slug: '/about', contentAr: '', contentEn: '' },
    { titleAr: 'سياسة الخصوصية', titleEn: 'Privacy Policy', slug: '/privacy-policy', contentAr: '', contentEn: '' },
    { titleAr: 'شروط الاستخدام', titleEn: 'Terms of Use', slug: '/terms', contentAr: '', contentEn: '' },
    { titleAr: 'سياسة الإرجاع', titleEn: 'Return Policy', slug: '/return-policy', contentAr, contentEn },
    { titleAr: 'دليل المقاسات', titleEn: 'Size Guide', slug: '/size-guide', contentAr: '', contentEn: '' },
    { titleAr: 'الأسئلة الشائعة', titleEn: 'FAQ', slug: '/faq', contentAr: '', contentEn: '' },
    { titleAr: 'سياسة الشحن', titleEn: 'Shipping Policy', slug: '/shipping', contentAr: '', contentEn: '' },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        ...page,
        status: 'published'
      }
    });
  }

  // Then strictly update Return Policy again to make sure its content is set
  await prisma.page.update({
    where: { slug: '/return-policy' },
    data: { contentAr, contentEn }
  });

  console.log('Pages seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
