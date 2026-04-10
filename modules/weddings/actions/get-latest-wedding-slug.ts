import { procedure_protected } from '@/integrations/orpc/procedure';
import { ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '../db-tables';
import { desc, eq } from 'drizzle-orm';

export const orpc_getLatestWeddingSlug = procedure_protected
  .handler(async ({ context: { db, auth } }) => {
    const [, latest] = await tryCatchDb(() =>
      db
        .select({ slug: table_weddings.slug })
        .from(table_weddings)
        .where(eq(table_weddings.ownerId, auth.userId))
        .orderBy(desc(table_weddings.createdAt))
        .limit(1),
    );

    return ok({ slug: latest?.[0]?.slug });
  })
  .callable();
