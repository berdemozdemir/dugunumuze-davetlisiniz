import { os } from "@orpc/server";
import { db } from "@/integrations/drizzle/db";

export const middleware_db = os.middleware(async ({ next }) => {
  return next({
    context: {
      db,
    },
  });
});
