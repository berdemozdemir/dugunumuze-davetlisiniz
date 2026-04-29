import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_eventTemplates } from '../db-tables';
import { asc } from 'drizzle-orm';

export const orpc_templates_list = procedure_protected.handler(
  async ({ context: { db } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_eventTemplates.id,
          key: table_eventTemplates.key,
          name: table_eventTemplates.name,
          defaultsJson: table_eventTemplates.defaultsJson,
        })
        .from(table_eventTemplates)
        .orderBy(asc(table_eventTemplates.name)),
    );

    if (dbErr) {
      return err({ reason: 'database-error', message: dbErr.message });
    }

    return ok({ templates: rows });
  },
).callable();

