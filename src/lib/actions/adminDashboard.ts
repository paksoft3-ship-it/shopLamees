'use server';

import { getAdminOrders } from './adminOrders';
import { getAdminProducts } from './adminProducts';

export async function getAdminDashboardStats() {
    const [orders, products] = await Promise.all([
        getAdminOrders(),
        getAdminProducts()
    ]);

    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'shipped' || o.status === 'processing');
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    const recentOrders = [...orders].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

    const lowStockItems = products
        .filter(p => p.variants.some(v => v.stock <= 15))
        .map(p => ({
            ...p,
            minStock: Math.min(...p.variants.map(v => v.stock))
        }))
        .sort((a, b) => a.minStock - b.minStock)
        .slice(0, 5);

    const publishedCount = products.filter(p => p.status === 'published').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return {
        ordersCount: orders.length,
        completedOrders,
        totalRevenue,
        avgOrder,
        recentOrders,
        bestSellers,
        lowStockItems,
        publishedCount,
        pendingOrders
    };
}
