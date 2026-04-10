import { orpc_login } from '@/modules/auth/actions/login';
import { orpc_signup } from '@/modules/auth/actions/signup';
import { orpc_getAuthSession } from '@/modules/auth/actions/get-auth-session';
import { orpc_weddings_create } from '@/modules/weddings/actions/create';
import { orpc_weddings_listMine } from '@/modules/weddings/actions/list-mine';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { orpc_updateWedding } from '@/modules/weddings/actions/update-wedding';
import { orpc_publishWedding } from '@/modules/weddings/actions/publish-wedding';
import { orpc_unpublishWedding } from '@/modules/weddings/actions/unpublish-wedding';
import { orpc_getInvitationBySlug } from '@/modules/templates/actions/get-invitation-by-slug';

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
    publish: orpc_publishWedding,
    unpublish: orpc_unpublishWedding,
  },
  templates: {
    getInvitationBySlug: orpc_getInvitationBySlug,
  },
} as const;
