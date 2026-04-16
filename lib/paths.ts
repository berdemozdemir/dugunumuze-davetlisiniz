export const paths = {
  home: '/',

  invitation: (slug: string) => `/${slug}`,

  unauthorized: '/unauthorized',

  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },

  dashboard: {
    base: '/dashboard',
    new: '/dashboard/new',
    wedding: {
      base: (weddingSlug: string) => `/dashboard/${weddingSlug}`,
      overview: (weddingSlug: string) => `/dashboard/${weddingSlug}/overview`,
      /** Düğün çekirdek bilgileri + kapak görseli (`modules/invitation`) */
      cover: (weddingSlug: string) => `/dashboard/${weddingSlug}/cover`,
      countdown: (weddingSlug: string) => `/dashboard/${weddingSlug}/countdown`,
      story: (weddingSlug: string) => `/dashboard/${weddingSlug}/story`,
      closing: (weddingSlug: string) => `/dashboard/${weddingSlug}/closing`,
      rsvp: (weddingSlug: string) => `/dashboard/${weddingSlug}/rsvp`,
      media: (weddingSlug: string) => `/dashboard/${weddingSlug}/media`,
      settings: (weddingSlug: string) => `/dashboard/${weddingSlug}/settings`,
    },
  },
} as const;
