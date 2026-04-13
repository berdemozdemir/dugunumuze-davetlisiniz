import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';

export const table_weddings = pgTable('weddings', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  ownerId: uuid('owner_id').notNull(),

  slug: text('slug').notNull().unique(),

  partner1Name: text('partner_1_name').notNull(),
  partner2Name: text('partner_2_name').notNull(),

  dateTime: timestamp('date_time', { withTimezone: true }).notNull(),
  city: text('city').notNull(),
  venueName: text('venue_name'),
  addressText: text('address_text').notNull(),

  publishedAt: timestamp('published_at', { withTimezone: true }),

  ...timestamps,
});
