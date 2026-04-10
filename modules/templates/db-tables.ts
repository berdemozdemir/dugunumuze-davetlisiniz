import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { table_weddings } from '@/modules/weddings/db-tables';

export const table_weddingTemplates = pgTable('wedding_templates', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  key: text('key').notNull().unique(),
  name: text('name').notNull(),

  defaultsJson: jsonb('defaults_json').notNull(),

  ...timestamps,
});

export const table_weddingOverrides = pgTable('wedding_overrides', {
  weddingId: uuid('wedding_id')
    .primaryKey()
    .notNull()
    .references(() => table_weddings.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id')
    .notNull()
    .references(() => table_weddingTemplates.id, { onDelete: 'cascade' }),

  overridesJson: jsonb('overrides_json').notNull(),

  ...timestamps,
});
