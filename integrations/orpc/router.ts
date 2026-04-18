import { orpc_login } from '@/modules/auth/actions/login';
import { orpc_signup } from '@/modules/auth/actions/signup';
import { orpc_getAuthSession } from '@/modules/auth/actions/get-auth-session';
import { orpc_weddings_create } from '@/modules/weddings/actions/create';
import { orpc_weddings_listMine } from '@/modules/weddings/actions/list-mine';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { orpc_publishWedding } from '@/modules/weddings/actions/publish-wedding';
import { orpc_unpublishWedding } from '@/modules/weddings/actions/unpublish-wedding';
import { orpc_weddings_getInvitationPreviewBySlug } from '@/modules/weddings/actions/get-invitation-preview-by-slug';
import { orpc_getInvitationBySlug } from '@/modules/templates/actions/get-invitation-by-slug';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_invitation_updateClosing } from '@/modules/invitation/actions/update-invitation-closing';
import { orpc_invitation_updateCover } from '@/modules/invitation/actions/update-invitation-cover';
import { orpc_invitation_updateCountdown } from '@/modules/invitation/actions/update-invitation-countdown';
import { orpc_invitation_updateStoryText } from '@/modules/invitation/actions/update-invitation-story-text';
import { orpc_invitation_updateVisibility } from '@/modules/invitation/actions/update-invitation-visibility';
import { orpc_invitation_updateMedia } from '@/modules/invitation/actions/update-invitation-media';

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
    getInvitationPreviewBySlug: orpc_weddings_getInvitationPreviewBySlug,
    publish: orpc_publishWedding,
    unpublish: orpc_unpublishWedding,
  },
  templates: {
    getInvitationBySlug: orpc_getInvitationBySlug,
    getWeddingInvitationSettings: orpc_templates_getWeddingInvitationSettings,
  },
  invitation: {
    updateCover: orpc_invitation_updateCover,
    updateClosing: orpc_invitation_updateClosing,
    updateCountdown: orpc_invitation_updateCountdown,
    updateStoryText: orpc_invitation_updateStoryText,
    updateVisibility: orpc_invitation_updateVisibility,
    updateMedia: orpc_invitation_updateMedia,
  },
} as const;
