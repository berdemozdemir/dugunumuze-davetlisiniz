import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { timestamps } from '@/lib/db/timestamps';
import { table_events } from '@/modules/events/db-tables';
import type { RsvpCompanionStored } from '@/modules/rsvp/types';

export const table_rsvpResponses = pgTable(
  'rsvp_responses',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),

    eventId: uuid('event_id')
      .notNull()
      .references(() => table_events.id, { onDelete: 'cascade' }),

    primaryFullName: text('primary_full_name').notNull(),
    primaryPhone: text('primary_phone').notNull(),

    companionsJson: jsonb('companions_json')
      .$type<RsvpCompanionStored[]>()
      .notNull(),

    note: text('note'),

    partySize: integer('party_size').notNull(),

    finalEventTitle: text('final_event_title'),
    finalEventAt: timestamp('final_event_at', { withTimezone: true }),

    ...timestamps,
  },
  (t) => [
    uniqueIndex('rsvp_responses_event_primary_phone_uid').on(
      t.eventId,
      t.primaryPhone,
    ),
  ],
);
