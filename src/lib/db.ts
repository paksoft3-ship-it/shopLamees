/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Prisma 6 constructor typing quirk — safe cast
export const prisma =
    globalForPrisma.prisma ?? (new (PrismaClient as unknown as new () => PrismaClient)());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
