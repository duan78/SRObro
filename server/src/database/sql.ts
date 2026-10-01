import { prisma } from './prisma';

/**
 * pg-style result shape expected by callers of query()
 */
export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount?: number;
}

/**
 * Minimal query-client surface used inside transaction() callbacks
 */
export interface SqlClient {
  query(sql: string, params?: any[]): Promise<any>;
}

/**
 * Execute a raw SQL query (pg-style result: { rows, rowCount })
 */
export const query = async <T = unknown>(sql: string, ...rest: any[]): Promise<QueryResult<T>> => {
  // Tolère les deux conventions: pg-style query(sql, [p1, p2]) et variadique
  // query(sql, p1, p2). Historique: DropManager passait un tableau →
  // « operator does not exist: text = text[] » sur toutes ses requêtes.
  const params = rest.length === 1 && Array.isArray(rest[0]) ? rest[0] : rest;
  const rows = (await prisma.$queryRawUnsafe(sql, ...params)) as T[];
  return {
    rows: Array.isArray(rows) ? rows : [rows],
    rowCount: Array.isArray(rows) ? rows.length : 1,
  };
};

/**
 * Execute a transaction
 */
export const transaction = async <callbackReturn>(
  callback: (client: SqlClient) => Promise<callbackReturn>,
): Promise<callbackReturn> => {
  return prisma.$transaction(async (tx) => {
    const client: SqlClient = {
      query: (sql: string, params?: any[]) => tx.$queryRawUnsafe(sql, ...(params ?? [])),
    };
    return callback(client);
  });
};
