import type { Config } from 'drizzle-kit';

export default {
  schema: [
    './database/schema/**',
    '**/db-tables.ts',
    '**/db-relations.ts',
    '**/db-enums.ts',
    '**/db-tables/**.ts',
    '**/db-relations/**.ts',
    '**/db-enums/**.ts',
  ],
  out: './database/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
