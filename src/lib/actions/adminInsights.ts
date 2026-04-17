'use server';

import prisma from '@/lib/db';
import { HomeVideoItem, normalizeHomeVideos } from '@/lib/homeVideos';
import { revalidateTag } from 'next/cache';

export interface AdminCouponInsight {
  code: string;
  uses: number;
  totalDiscount: number;
  totalRevenue: number;
  lastUsedAt: string;
  active: boolean;
}

export interface AdminReportInsight {
  totalRevenue: number;
  totalOrders: number;
  avgOrder: number;
  completedOrders: number;
  cancelledOrders: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  topProducts: { nameAr: string; nameEn: string; sku: string; sold: number; revenue: number; stock: number }[];
  countrySales: { country: string; orders: number; revenue: number }[];
  paymentMethods: { method: string; count: number; amount: number }[];
}

export interface AdminShippingInsight {
  shippingOrders: number;
  avgFulfillmentDays: number;
  freeShippingRate: number;
  successRate: number;
  zones: { country: 'QA' | 'SA'; orders: number; shippingFeeAvg: number }[];
  recentShipments: { orderId: string; customer: string; country: string; status: string; expectedDate: string }[];
}

export interface AdminPaymentsInsight {
  monthlyRevenue: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  refundedAmount: number;
  methodDistribution: { method: string; count: number; amount: number }[];
  recentTransactions: { orderId: string; customer: string; amount: number; method: string; status: string; date: string }[];
}

export interface AdminMarketingInsight {
  totalAttributedRevenue: number;
  activeDiscountCodes: number;
  discountCodePerformance: { code: string; uses: number; revenue: number; discount: number }[];
  topCountries: { country: string; customers: number }[];
}

export interface AdminSEOInsight {
  productsWithEnTitle: number;
  productsWithEnDesc: number;
  productsCount: number;
  categoriesWithEnName: number;
  categoriesCount: number;
  pages: { page: string; path: string; title: string; desc: string; score: number }[];
}

export interface AdminSettingsDTO {
  storeName: string;
  whatsappNumber: string;
  shippingQarQA: number;
  shippingSarSA: number;
  freeShipAbove: number;
  defaultCurrency: 'QAR' | 'SAR';
  vatPercent: number;
  homeVideos: HomeVideoItem[];
}

function getMonthsBack(n: number): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return labels;
}

export async function getAdminCouponInsights(): Promise<AdminCouponInsight[]> {
  const orders = await prisma.order.findMany({
    where: { discountCode: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: {
      discountCode: true,
      discount: true,
      total: true,
      createdAt: true,
    },
  });

  const map = new Map<string, AdminCouponInsight>();

  for (const order of orders) {
    const code = order.discountCode?.trim();
    if (!code) continue;

    const existing = map.get(code);
    const discount = Number(order.discount);
    const revenue = Number(order.total);

    if (!existing) {
      map.set(code, {
        code,
        uses: 1,
        totalDiscount: discount,
        totalRevenue: revenue,
        lastUsedAt: order.createdAt.toISOString(),
        active: Date.now() - order.createdAt.getTime() < 90 * 24 * 60 * 60 * 1000,
      });
      continue;
    }

    existing.uses += 1;
    existing.totalDiscount += discount;
    existing.totalRevenue += revenue;
    if (order.createdAt.toISOString() > existing.lastUsedAt) {
      existing.lastUsedAt = order.createdAt.toISOString();
    }
    existing.active = Date.now() - new Date(existing.lastUsedAt).getTime() < 90 * 24 * 60 * 60 * 1000;
  }

  return Array.from(map.values()).sort((a, b) => b.uses - a.uses);
}

export async function getAdminReportInsights(): Promise<AdminReportInsight> {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const [orders, items, products] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      include: { address: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: sixMonthsAgo } } },
      include: { variant: true },
    }),
    prisma.product.findMany({
      include: { variants: true },
    }),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length;

  const monthKeys = getMonthsBack(6);
  const monthMap = new Map(monthKeys.map((k) => [k, { month: k, revenue: 0, orders: 0 }]));
  for (const o of orders) {
    const k = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
    const item = monthMap.get(k);
    if (!item) continue;
    item.orders += 1;
    item.revenue += Number(o.total);
  }

  const productMap = new Map<string, { nameAr: string; nameEn: string; sku: string; sold: number; revenue: number }>();
  for (const i of items) {
    const sku = i.sku || i.variant?.sku || i.id;
    const key = sku;
    const sold = i.qty;
    const revenue = Number(i.lineTotal);
    if (!productMap.has(key)) {
      productMap.set(key, {
        nameAr: i.nameSnapshotAr,
        nameEn: i.nameSnapshotEn,
        sku,
        sold,
        revenue,
      });
    } else {
      const p = productMap.get(key)!;
      p.sold += sold;
      p.revenue += revenue;
    }
  }

  const stockBySku = new Map<string, number>();
  for (const p of products) {
    for (const v of p.variants) {
      stockBySku.set(v.sku, v.stock);
    }
  }

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8)
    .map((p) => ({ ...p, stock: stockBySku.get(p.sku) ?? 0 }));

  const countryMap = new Map<string, { country: string; orders: number; revenue: number }>();
  for (const o of orders) {
    const country = o.country === 'QA' ? 'Qatar' : 'Saudi Arabia';
    if (!countryMap.has(country)) {
      countryMap.set(country, { country, orders: 0, revenue: 0 });
    }
    const c = countryMap.get(country)!;
    c.orders += 1;
    c.revenue += Number(o.total);
  }

  const methodMap = new Map<string, { method: string; count: number; amount: number }>();
  for (const o of orders) {
    const method = o.paymentMethod || 'Unknown';
    if (!methodMap.has(method)) {
      methodMap.set(method, { method, count: 0, amount: 0 });
    }
    const m = methodMap.get(method)!;
    m.count += 1;
    m.amount += Number(o.total);
  }

  return {
    totalRevenue,
    totalOrders,
    avgOrder,
    completedOrders,
    cancelledOrders,
    monthlyRevenue: Array.from(monthMap.values()),
    topProducts,
    countrySales: Array.from(countryMap.values()).sort((a, b) => b.revenue - a.revenue),
    paymentMethods: Array.from(methodMap.values()).sort((a, b) => b.count - a.count),
  };
}

export async function getAdminShippingInsights(): Promise<AdminShippingInsight> {
  const orders = await prisma.order.findMany({
    include: { address: true },
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  const shippingOrders = orders.filter((o) => o.status === 'SHIPPED' || o.status === 'COMPLETED').length;

  const fulfilled = orders.filter((o) => o.status === 'SHIPPED' || o.status === 'COMPLETED');
  const avgFulfillmentDays = fulfilled.length
    ? fulfilled.reduce((s, o) => s + Math.max(0, (o.updatedAt.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24)), 0) / fulfilled.length
    : 0;

  const freeShippingRate = orders.length
    ? (orders.filter((o) => Number(o.shippingFee) === 0).length / orders.length) * 100
    : 0;

  const successRate = orders.length
    ? (orders.filter((o) => o.status === 'COMPLETED').length / orders.length) * 100
    : 0;

  const qa = orders.filter((o) => o.country === 'QA');
  const sa = orders.filter((o) => o.country === 'SA');

  const zones = [
    {
      country: 'QA' as const,
      orders: qa.length,
      shippingFeeAvg: qa.length ? qa.reduce((s, o) => s + Number(o.shippingFee), 0) / qa.length : 0,
    },
    {
      country: 'SA' as const,
      orders: sa.length,
      shippingFeeAvg: sa.length ? sa.reduce((s, o) => s + Number(o.shippingFee), 0) / sa.length : 0,
    },
  ];

  const recentShipments = fulfilled.slice(0, 20).map((o) => ({
    orderId: o.id,
    customer: o.customerName,
    country: o.country === 'QA' ? 'Qatar' : 'Saudi Arabia',
    status: o.status,
    expectedDate: new Date(o.updatedAt.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  return {
    shippingOrders,
    avgFulfillmentDays,
    freeShippingRate,
    successRate,
    zones,
    recentShipments,
  };
}

export async function getAdminPaymentsInsights(): Promise<AdminPaymentsInsight> {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: monthAgo } },
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  const monthlyRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const successfulTransactions = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'SHIPPED').length;
  const pendingTransactions = orders.filter((o) => o.status === 'NEW' || o.status === 'PROCESSING').length;
  const failedTransactions = orders.filter((o) => o.status === 'CANCELLED').length;
  const refundedAmount = orders.filter((o) => o.status === 'CANCELLED').reduce((s, o) => s + Number(o.total), 0);

  const methodMap = new Map<string, { method: string; count: number; amount: number }>();
  for (const o of orders) {
    const method = o.paymentMethod || 'Unknown';
    if (!methodMap.has(method)) {
      methodMap.set(method, { method, count: 0, amount: 0 });
    }
    const item = methodMap.get(method)!;
    item.count += 1;
    item.amount += Number(o.total);
  }

  const recentTransactions = orders.slice(0, 25).map((o) => ({
    orderId: o.id,
    customer: o.customerName,
    amount: Number(o.total),
    method: o.paymentMethod,
    status: o.status,
    date: o.createdAt.toISOString(),
  }));

  return {
    monthlyRevenue,
    successfulTransactions,
    pendingTransactions,
    failedTransactions,
    refundedAmount,
    methodDistribution: Array.from(methodMap.values()).sort((a, b) => b.count - a.count),
    recentTransactions,
  };
}

export async function getAdminMarketingInsights(): Promise<AdminMarketingInsight> {
  const [couponInsights, orders] = await Promise.all([
    getAdminCouponInsights(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
  ]);

  const totalAttributedRevenue = couponInsights.reduce((s, c) => s + c.totalRevenue, 0);
  const activeDiscountCodes = couponInsights.filter((c) => c.active).length;

  const phoneCountryMap = new Map<string, string>();
  for (const o of orders) {
    const phone = o.phone.replace(/\D/g, '');
    if (!phone) continue;
    if (!phoneCountryMap.has(phone)) {
      phoneCountryMap.set(phone, o.country === 'QA' ? 'Qatar' : 'Saudi Arabia');
    }
  }

  const countryCounts = new Map<string, number>();
  Array.from(phoneCountryMap.values()).forEach((country) => {
    countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
  });

  return {
    totalAttributedRevenue,
    activeDiscountCodes,
    discountCodePerformance: couponInsights.map((c) => ({
      code: c.code,
      uses: c.uses,
      revenue: c.totalRevenue,
      discount: c.totalDiscount,
    })),
    topCountries: Array.from(countryCounts.entries())
      .map(([country, customers]) => ({ country, customers }))
      .sort((a, b) => b.customers - a.customers),
  };
}

export async function getAdminSEOInsights(): Promise<AdminSEOInsight> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      take: 100,
    }),
  ]);

  const productsWithEnTitle = products.filter((p) => Boolean(p.titleEn?.trim())).length;
  const productsWithEnDesc = products.filter((p) => Boolean(p.descEn?.trim())).length;
  const categoriesWithEnName = categories.filter((c) => Boolean(c.nameEn?.trim())).length;

  const pages = [
    { page: 'Home', path: '/', title: 'Shop Lamees', desc: 'Store homepage', score: 90 },
    { page: 'Products', path: '/latest', title: 'Latest products', desc: 'Products listing', score: 84 },
    { page: 'Privacy Policy', path: '/privacy-policy', title: 'Privacy Policy', desc: 'Policy page', score: 78 },
    { page: 'Terms', path: '/terms', title: 'Terms', desc: 'Terms page', score: 76 },
    { page: 'Return Policy', path: '/return-policy', title: 'Returns', desc: 'Returns page', score: 77 },
  ];

  return {
    productsWithEnTitle,
    productsWithEnDesc,
    productsCount: products.length,
    categoriesWithEnName,
    categoriesCount: categories.length,
    pages,
  };
}

export async function getAdminStoreSettings(): Promise<AdminSettingsDTO> {
  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  let parsedHomeVideos: unknown = [];
  try {
    parsedHomeVideos = JSON.parse(settings.homeVideosJson || '[]');
  } catch {
    parsedHomeVideos = [];
  }

  return {
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    shippingQarQA: Number(settings.shippingQarQA),
    shippingSarSA: Number(settings.shippingSarSA),
    freeShipAbove: Number(settings.freeShipAbove),
    defaultCurrency: settings.defaultCurrency,
    vatPercent: Number(settings.vatPercent),
    homeVideos: normalizeHomeVideos(parsedHomeVideos),
  };
}

export interface AdminAuditEntry {
  id: string;
  type: 'order' | 'product' | 'settings';
  actionEn: string;
  actionAr: string;
  detailEn: string;
  detailAr: string;
  time: string;
  user: string;
}

export async function getAdminAuditLog(): Promise<AdminAuditEntry[]> {
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 30,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        customerName: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const statusLabels: Record<string, { en: string; ar: string }> = {
    NEW: { en: 'New', ar: 'جديد' },
    PROCESSING: { en: 'Processing', ar: 'قيد التنفيذ' },
    SHIPPED: { en: 'Shipped', ar: 'تم الشحن' },
    COMPLETED: { en: 'Completed', ar: 'مكتمل' },
    CANCELLED: { en: 'Cancelled', ar: 'ملغي' },
  };

  const entries: AdminAuditEntry[] = [];

  for (const o of orders) {
    const statusEn = statusLabels[o.status]?.en ?? o.status;
    const statusAr = statusLabels[o.status]?.ar ?? o.status;
    const isNew = Math.abs(o.updatedAt.getTime() - o.createdAt.getTime()) < 2000;
    entries.push({
      id: `order-${o.id}`,
      type: 'order',
      actionEn: isNew ? 'New Order' : 'Order Updated',
      actionAr: isNew ? 'طلب جديد' : 'تحديث طلب',
      detailEn: `Order #${o.orderNumber} — ${o.customerName} — Status: ${statusEn}`,
      detailAr: `طلب #${o.orderNumber} — ${o.customerName} — الحالة: ${statusAr}`,
      time: o.updatedAt.toISOString(),
      user: 'system',
    });
  }

  for (const p of products) {
    const isNew = Math.abs(p.updatedAt.getTime() - p.createdAt.getTime()) < 2000;
    entries.push({
      id: `product-${p.id}`,
      type: 'product',
      actionEn: isNew ? 'Product Added' : 'Product Updated',
      actionAr: isNew ? 'إضافة منتج' : 'تحديث منتج',
      detailEn: `${p.titleEn || p.titleAr} — ${p.isPublished ? 'Published' : 'Draft'}`,
      detailAr: `${p.titleAr} — ${p.isPublished ? 'منشور' : 'مسودة'}`,
      time: p.updatedAt.toISOString(),
      user: 'system',
    });
  }

  return entries.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 40);
}

export interface AdminMediaImage {
  id: string;
  name: string;
  url: string;
  productId: string;
  productNameAr: string;
  productNameEn: string;
}

export async function getAdminProductImages(): Promise<AdminMediaImage[]> {
  const images = await prisma.productImage.findMany({
    orderBy: { sortOrder: 'asc' },
    take: 200,
    include: {
      product: {
        select: { titleAr: true, titleEn: true },
      },
    },
  });

  return images.map((img) => ({
    id: img.id,
    name: img.url.split('/').pop() || img.id,
    url: img.url,
    productId: img.productId,
    productNameAr: img.product.titleAr,
    productNameEn: img.product.titleEn,
  }));
}

export async function updateAdminStoreSettings(payload: AdminSettingsDTO) {
  const homeVideos = normalizeHomeVideos(payload.homeVideos);

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      storeName: payload.storeName,
      whatsappNumber: payload.whatsappNumber,
      shippingQarQA: payload.shippingQarQA,
      shippingSarSA: payload.shippingSarSA,
      freeShipAbove: payload.freeShipAbove,
      defaultCurrency: payload.defaultCurrency,
      vatPercent: payload.vatPercent,
      homeVideosJson: JSON.stringify(homeVideos),
    },
    create: {
      id: 1,
      storeName: payload.storeName,
      whatsappNumber: payload.whatsappNumber,
      shippingQarQA: payload.shippingQarQA,
      shippingSarSA: payload.shippingSarSA,
      freeShipAbove: payload.freeShipAbove,
      defaultCurrency: payload.defaultCurrency,
      vatPercent: payload.vatPercent,
      homeVideosJson: JSON.stringify(homeVideos),
    },
  });

  revalidateTag('home-videos');
  revalidateTag('products');
  revalidateTag('categories');
}
