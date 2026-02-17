// In production, this will use the actual @prisma/client package

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

// Mock Prisma client for demo mode
const mockPrismaClient = {
  user: {
    findUnique: async () => null,
    create: async (data: any) => ({ id: "1", ...data.data }),
    update: async (data: any) => data.data,
    delete: async () => null,
    findMany: async () => [],
  },
  product: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ id: "1", ...data.data }),
    update: async (data: any) => data.data,
  },
  cart: {
    findUnique: async () => null,
    create: async (data: any) => ({ id: "1", ...data.data }),
    update: async (data: any) => data.data,
    delete: async () => null,
  },
  cartItem: {
    findMany: async () => [],
    create: async (data: any) => ({ id: "1", ...data.data }),
    update: async (data: any) => data.data,
    delete: async () => null,
  },
  order: {
    findMany: async () => [],
    create: async (data: any) => ({ id: "1", ...data.data }),
    update: async (data: any) => data.data,
  },
  discount: {
    findMany: async () => [],
    findUnique: async () => null,
  },
}

export const prisma = globalForPrisma.prisma ?? mockPrismaClient

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
