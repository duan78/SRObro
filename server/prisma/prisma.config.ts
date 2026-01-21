/**
 * SRObro - Prisma 7 Configuration
 *
 * Prisma 7 moved datasource URL configuration from schema.prisma to this file.
 * This allows for more flexible configuration and better environment variable handling.
 */

import { defineConfig } from '@prisma/client';

export default defineConfig({
  schema: {
    datasourceUrl: process.env.DATABASE_URL,
  },
});
