export const paths = {
  home: '/',

  invitation: {
    base: (slug: string) => `/${slug}`,
    preview: (slug: string) => `${paths.invitation.base(slug)}?preview=1`,
  },

  unauthorized: '/unauthorized',

  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },

  dashboard: {
    base: '/dashboard',
    /** Yeni davet/etkinlik oluşturma formu */
    new: '/dashboard/new',
    event: {
      base: (eventSlug: string) => `/dashboard/${eventSlug}`,
      overview: (eventSlug: string) => `/dashboard/${eventSlug}/overview`,
      /** Çift isimleri + kapak (`modules/invitation`); dinamik segment: `[eventSlug]`. */
      cover: (eventSlug: string) => `/dashboard/${eventSlug}/cover`,
      countdown: (eventSlug: string) => `/dashboard/${eventSlug}/countdown`,
      story: (eventSlug: string) => `/dashboard/${eventSlug}/story`,
      closing: (eventSlug: string) => `/dashboard/${eventSlug}/closing`,
      rsvp: (eventSlug: string) => `/dashboard/${eventSlug}/rsvp`,
      media: (eventSlug: string) => `/dashboard/${eventSlug}/media`,
      settings: (eventSlug: string) => `/dashboard/${eventSlug}/settings`,
    },
  },
} as const;
