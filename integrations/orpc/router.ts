import { orpc_login } from '@/modules/auth/actions/login';
import { orpc_signup } from '@/modules/auth/actions/signup';
import { orpc_getAuthSession } from '@/modules/auth/actions/get-auth-session';
import { orpc_createEvent } from '@/modules/events/actions/create-event';
import { orpc_events_listMine } from '@/modules/events/actions/list-mine';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';
import { orpc_publishEvent } from '@/modules/events/actions/publish-event';
import { orpc_unpublishEvent } from '@/modules/events/actions/unpublish-event';
import { orpc_events_getInvitationPreviewBySlug } from '@/modules/events/actions/get-invitation-preview-by-slug';
import { orpc_getInvitationBySlug } from '@/modules/templates/actions/get-invitation-by-slug';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
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
  events: {
    create: orpc_createEvent,
    listMine: orpc_events_listMine,
    getBySlug: orpc_getEventBySlug,
    getInvitationPreviewBySlug: orpc_events_getInvitationPreviewBySlug,
    publish: orpc_publishEvent,
    unpublish: orpc_unpublishEvent,
  },
  templates: {
    getInvitationBySlug: orpc_getInvitationBySlug,
    getEventInvitationSettings: orpc_templates_getEventInvitationSettings,
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
