import type { Config } from 'drizzle-kit';

export default {
  schema: './src/services/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './productivity.db',
  },
} satisfies Config;
