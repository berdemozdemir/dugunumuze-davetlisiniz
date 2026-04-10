import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';

export const table_weddingTemplates = pgTable('wedding_templates', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  key: text('key').notNull().unique(),
  name: text('name').notNull(),

  defaultsJson: jsonb('defaults_json').notNull(),

  ...timestamps,
});

export const table_weddingOverrides = pgTable('wedding_overrides', {
  weddingId: uuid('wedding_id').primaryKey().notNull(),
  templateId: uuid('template_id').notNull(),

  overridesJson: jsonb('overrides_json').notNull(),

  ...timestamps,
});

