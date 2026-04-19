import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { table_events } from '@/modules/events/db-tables';

export const table_eventTemplates = pgTable('event_templates', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  key: text('key').notNull().unique(),
  name: text('name').notNull(),

  defaultsJson: jsonb('defaults_json').notNull(),

  ...timestamps,
});

export const table_eventOverrides = pgTable('event_overrides', {
  eventId: uuid('event_id')
    .primaryKey()
    .notNull()
    .references(() => table_events.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id')
    .notNull()
    .references(() => table_eventTemplates.id, { onDelete: 'cascade' }),

  overridesJson: jsonb('overrides_json').notNull(),

  ...timestamps,
});
