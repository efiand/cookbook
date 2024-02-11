import { PrismaClient } from '@prisma/client';

type PrismaClientSingleton = ReturnType<typeof createClient>;

const createClient = () => new PrismaClient();
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}

export default prisma;
