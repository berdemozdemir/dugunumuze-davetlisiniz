/**
 * What the heck is this file?
 *
 * This file imports all of our schemas into one place so we can give it to the drizzle
 * client later for use with its query api.
 *
 * See @https://orm.drizzle.team/docs/sql-schema-declaration#organize-your-schema-files
 */

// ## MODELS ##
import * as userSchema from '@/modules/auth/db-tables';
import * as eventSchema from '@/modules/events/db-tables';
import * as templateSchema from '@/modules/templates/db-tables';
import * as rsvpSchema from '@/modules/rsvp/db-tables';

// ## RELATIONS ##

// (e.g. if you have relations)
// import * as userRelations from "@/modules/auth/db-relations";

export const drizzleSchema = {
  ...userSchema,
  ...eventSchema,
  ...templateSchema,
  ...rsvpSchema,
};
