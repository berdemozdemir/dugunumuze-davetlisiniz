import { pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { table_users } from '../auth/db-tables';
import { table_eventTemplates } from '../templates/db-tables';

export const table_events = pgTable('events', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  ownerId: uuid('owner_id')
    .references(() => table_users.id, { onDelete: 'cascade' })
    .notNull(),

  slug: text('slug').notNull().unique(),

  templateId: uuid('template_id')
    .references(() => table_eventTemplates.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  status: text('status').notNull().default('draft'),
  currentStep: smallint('current_step').notNull().default(1),

  primaryName: text('primary_name').notNull(),
  secondaryName: text('secondary_name'),

  dateTime: timestamp('date_time', { withTimezone: true }).notNull(),
  city: text('city').notNull(),
  venueName: text('venue_name'),
  addressText: text('address_text').notNull(),

  publishedAt: timestamp('published_at', { withTimezone: true }),

  ...timestamps,
});
