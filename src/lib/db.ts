/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function makeClient() {
    const client = new PrismaClient();

    // Neon free tier suspends after 5 min. On cold start the first query fails
    // with a connection error while the DB wakes up (~1-3s). This middleware
    // retries once after a short delay so the caller never sees the error.
    client.$use(async (params, next) => {
        try {
            return await next(params);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            const isConnectionError =
                msg.includes("Can't reach database server") ||
                msg.includes('Connection refused') ||
                msg.includes('connection timeout') ||
                msg.includes('ECONNREFUSED');

            if (!isConnectionError) throw err;

            // Wait for Neon to wake up, then retry once
            await new Promise(r => setTimeout(r, 3000));
            return await next(params);
        }
    });

    return client;
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
