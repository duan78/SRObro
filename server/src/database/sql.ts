import { prisma } from './prisma';

/**
 * Execute a raw SQL query
 */
export const query = async (sql: string, ...params: any[]) => {
  return prisma.$queryRawUnsafe(sql, ...params);
};

/**
 * Execute a transaction
 */
export const transaction = async (callback: (prisma: any) => Promise<any>) => {
  return prisma.$transaction(callback);
};
