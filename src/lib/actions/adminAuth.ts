'use server';

import prisma from '@/lib/db';
import { compare, hash } from 'bcryptjs';
import { createHash } from 'crypto';

export type AdminRoleClient = 'admin_owner' | 'admin_staff';

async function verifyAdminPassword(plainPassword: string, storedHash: string): Promise<{
  valid: boolean;
  legacySha256: boolean;
}> {
  if (!storedHash) return { valid: false, legacySha256: false };

  // Current format: bcrypt hash
  if (storedHash.startsWith('$2')) {
    const valid = await compare(plainPassword, storedHash);
    return { valid, legacySha256: false };
  }

  // Legacy format: sha256 hex hash from old seed script
  const sha256 = createHash('sha256').update(plainPassword).digest('hex');
  const valid = sha256 === storedHash;
  return { valid, legacySha256: valid };
}

export async function loginAdmin(email: string, password: string): Promise<{
  ok: boolean;
  message?: string;
  user?: { email: string; role: AdminRoleClient };
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
    select: { email: true, passwordHash: true, role: true, isActive: true },
  });

  if (!user) return { ok: false, message: 'Invalid email or password' };
  if (!user.isActive) return { ok: false, message: 'This admin account is disabled' };

  const passwordCheck = await verifyAdminPassword(password, user.passwordHash);
  if (!passwordCheck.valid) return { ok: false, message: 'Invalid email or password' };

  // Seamlessly migrate old sha256 hash to bcrypt after successful login.
  if (passwordCheck.legacySha256) {
    await prisma.adminUser.update({
      where: { email: normalizedEmail },
      data: { passwordHash: await hash(password, 10) },
    });
  }

  return {
    ok: true,
    user: {
      email: user.email,
      role: user.role === 'OWNER' ? 'admin_owner' : 'admin_staff',
    },
  };
}

export async function updateAdminLoginCredentials(input: {
  currentEmail: string;
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}): Promise<{ ok: boolean; message: string; email?: string }> {
  const currentEmail = input.currentEmail.trim().toLowerCase();
  const nextEmail = (input.newEmail || '').trim().toLowerCase();
  const nextPassword = (input.newPassword || '').trim();

  if (!currentEmail || !input.currentPassword) {
    return { ok: false, message: 'Current email and password are required' };
  }

  if (!nextEmail && !nextPassword) {
    return { ok: false, message: 'Provide a new email or new password' };
  }

  if (nextPassword && nextPassword.length < 6) {
    return { ok: false, message: 'New password must be at least 6 characters' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: currentEmail },
    select: { id: true, passwordHash: true },
  });

  if (!user) return { ok: false, message: 'Current credentials are invalid' };

  const passwordCheck = await verifyAdminPassword(input.currentPassword, user.passwordHash);
  if (!passwordCheck.valid) return { ok: false, message: 'Current credentials are invalid' };

  if (nextEmail && nextEmail !== currentEmail) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: nextEmail },
      select: { id: true },
    });
    if (existing) return { ok: false, message: 'This new email is already in use' };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      ...(nextEmail ? { email: nextEmail } : {}),
      ...(nextPassword ? { passwordHash: await hash(nextPassword, 10) } : {}),
    },
  });

  return { ok: true, message: 'Login credentials updated', email: nextEmail || currentEmail };
}
