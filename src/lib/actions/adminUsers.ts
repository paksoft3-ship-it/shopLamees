'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';

export type AdminPanelRole = 'owner' | 'staff';

export interface AdminPanelUser {
  id: string;
  name: string;
  email: string;
  role: AdminPanelRole;
  status: 'active' | 'disabled';
  createdAt: string;
}

function mapRole(role: 'OWNER' | 'STAFF'): AdminPanelRole {
  return role === 'OWNER' ? 'owner' : 'staff';
}

export async function getAdminUsers(): Promise<AdminPanelUser[]> {
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: mapRole(u.role),
    status: u.isActive ? 'active' : 'disabled',
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function createAdminUser(data: {
  name: string;
  email: string;
  password: string;
  role: AdminPanelRole;
}) {
  const passwordHash = await hash(data.password, 10);

  await prisma.adminUser.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash,
      role: data.role === 'owner' ? 'OWNER' : 'STAFF',
      isActive: true,
    },
  });

  revalidatePath('/admin/users');
}

export async function updateAdminUserStatus(id: string, status: 'active' | 'disabled') {
  await prisma.adminUser.update({
    where: { id },
    data: { isActive: status === 'active' },
  });

  revalidatePath('/admin/users');
}

export async function deleteAdminUser(id: string) {
  await prisma.adminUser.delete({ where: { id } });
  revalidatePath('/admin/users');
}
