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
      invitation: (weddingSlug: string) =>
        `/dashboard/${weddingSlug}/invitation`,
      rsvp: (weddingSlug: string) => `/dashboard/${weddingSlug}/rsvp`,
      media: (weddingSlug: string) => `/dashboard/${weddingSlug}/media`,
      settings: (weddingSlug: string) => `/dashboard/${weddingSlug}/settings`,
    },
  },
} as const;
