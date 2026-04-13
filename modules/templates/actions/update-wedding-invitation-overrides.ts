import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '@/modules/weddings/db-tables';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { bindDefaultTemplateToWedding } from './bind-default-template-to-wedding';
import { table_weddingOverrides } from '../db-tables';
import { invitationOverridesSchema } from '../schemas/invitation-overrides';

export const orpc_templates_updateWeddingInvitationOverrides =
  procedure_protected
    .input(
      z.object({
        weddingSlug: z.string().min(1),
        overrides: invitationOverridesSchema,
      }),
    )
    .handler(async ({ input, context: { db, auth } }) => {
      const [weddingErr, weddingRows] = await tryCatchDb(() =>
        db
          .select({
            id: table_weddings.id,
          })
          .from(table_weddings)
          .where(
            and(
              eq(table_weddings.slug, input.weddingSlug),
              eq(table_weddings.ownerId, auth.userId),
            ),
          )
          .limit(1),
      );

      if (weddingErr) {
        return err({ reason: 'database-error', message: weddingErr.message });
      }

      const wedding = weddingRows[0];
      if (!wedding) {
        return err({ reason: 'not-found', message: 'Wedding not found' });
      }

      const [bindErr] = await bindDefaultTemplateToWedding(db, wedding.id);
      if (bindErr) {
        return err({
          reason: 'template-bind-failed',
          message: bindErr.message,
        });
      }

      const now = new Date();
      const [updateErr] = await tryCatchDb(() =>
        db
          .update(table_weddingOverrides)
          .set({
            overridesJson: input.overrides,
            updatedAt: now,
          })
          .where(eq(table_weddingOverrides.weddingId, wedding.id)),
      );

      if (updateErr) {
        return err({ reason: 'database-error', message: updateErr.message });
      }

      return ok({ ok: true });
    })
    .callable();
