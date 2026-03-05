'use server';

import prisma from '@/lib/db';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  orders: number;
  spent: number;
  lastOrderAt: string;
  status: 'vip' | 'regular' | 'new';
}

export interface AdminCustomerDetails extends AdminCustomer {
  orderIds: string[];
  latestAddress: {
    city: string;
    zone: string;
    street: string;
    building: string;
    country: string;
  } | null;
}

function normalizeCustomerId(phone: string, email: string | null): string {
  const phoneKey = phone.replace(/\D/g, '');
  if (phoneKey) return phoneKey;
  return (email || '').toLowerCase();
}

function customerStatus(orderCount: number): 'vip' | 'regular' | 'new' {
  if (orderCount >= 7) return 'vip';
  if (orderCount >= 3) return 'regular';
  return 'new';
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { address: true },
  });

  const map = new Map<string, {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    orders: number;
    spent: number;
    lastOrderAt: Date;
  }>();

  for (const order of orders) {
    const id = normalizeCustomerId(order.phone, order.email);
    if (!id) continue;

    const existing = map.get(id);
    if (!existing) {
      map.set(id, {
        id,
        name: order.customerName,
        email: order.email || '',
        phone: order.phone,
        country: order.country === 'QA' ? 'Qatar' : 'Saudi Arabia',
        orders: 1,
        spent: Number(order.total),
        lastOrderAt: order.createdAt,
      });
      continue;
    }

    existing.orders += 1;
    existing.spent += Number(order.total);
    if (order.createdAt > existing.lastOrderAt) {
      existing.lastOrderAt = order.createdAt;
      existing.name = order.customerName;
      existing.email = order.email || existing.email;
      existing.phone = order.phone;
      existing.country = order.country === 'QA' ? 'Qatar' : 'Saudi Arabia';
    }
  }

  return Array.from(map.values())
    .map((c) => ({
      ...c,
      lastOrderAt: c.lastOrderAt.toISOString(),
      status: customerStatus(c.orders),
    }))
    .sort((a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime());
}

export async function getAdminCustomerDetails(customerId: string): Promise<AdminCustomerDetails | null> {
  const allOrders = await prisma.order.findMany({
    include: { address: true },
    orderBy: { createdAt: 'desc' },
  });

  const orders = allOrders.filter((order) => normalizeCustomerId(order.phone, order.email) === customerId);
  if (orders.length === 0) return null;

  const latest = orders[0];
  const spent = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return {
    id: normalizeCustomerId(latest.phone, latest.email),
    name: latest.customerName,
    email: latest.email || '',
    phone: latest.phone,
    country: latest.country === 'QA' ? 'Qatar' : 'Saudi Arabia',
    orders: orders.length,
    spent,
    lastOrderAt: latest.createdAt.toISOString(),
    status: customerStatus(orders.length),
    orderIds: orders.map((o) => o.id),
    latestAddress: latest.address
      ? {
          city: latest.address.city,
          zone: latest.address.zone || '',
          street: latest.address.street,
          building: latest.address.building || '',
          country: latest.address.country,
        }
      : null,
  };
}
