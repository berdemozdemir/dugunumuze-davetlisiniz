import { orpc_login } from '@/modules/auth/actions/login';
import { orpc_signup } from '@/modules/auth/actions/signup';
import { orpc_getAuthSession } from '@/modules/auth/actions/get-auth-session';
import { orpc_weddings_create } from '@/modules/weddings/actions/create';
import { orpc_weddings_listMine } from '@/modules/weddings/actions/list-mine';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { orpc_updateWedding } from '@/modules/weddings/actions/update-wedding';

export const router = {
  auth: {
    login: orpc_login,
    signup: orpc_signup,
    getAuthSession: orpc_getAuthSession,
  },
  weddings: {
    create: orpc_weddings_create,
    listMine: orpc_weddings_listMine,
    getBySlug: orpc_getWeddingBySlug,
    update: orpc_updateWedding,
  },
} as const;
