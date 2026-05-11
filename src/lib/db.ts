import { PrismaClient } from '@prisma/client';

function makeClient() {
    return new PrismaClient().$extends({
        query: {
            $allOperations({ args, query }: { args: unknown; query: (args: unknown) => Promise<unknown> }) {
                return query(args).catch(async (err: unknown) => {
                    const msg = err instanceof Error ? err.message : String(err);
                    const code = (err as { code?: string }).code;

                    const isRetryable =
                        msg.includes("Can't reach database server") ||
                        msg.includes('Connection refused') ||
                        msg.includes('ECONNREFUSED') ||
                        msg.includes('Timed out fetching a new connection') ||
                        code === 'P2024';

                    if (!isRetryable) throw err;

                    // Wait for Neon to wake up / free a connection, then retry once
                    await new Promise(r => setTimeout(r, 4000));
                    return query(args);
                });
            },
        },
    });
}

type ExtendedPrismaClient = ReturnType<typeof makeClient>;

const globalForPrisma = globalThis as unknown as { prisma: ExtendedPrismaClient };

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
