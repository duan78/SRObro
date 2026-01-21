import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
const prisma = new PrismaClient();

// Re-export all Prisma types
export * from '@prisma/client';

// Export the prisma instance as default
export default prisma;

// Also export as named export for convenience
export { prisma };