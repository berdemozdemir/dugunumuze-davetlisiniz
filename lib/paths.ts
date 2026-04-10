export const paths = {
  home: '/',

  unauthorized: '/unauthorized',

  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },

  dashboard: {
    base: '/dashboard',
    new: '/dashboard/new',
    wedding: {
      base: (weddingId: string) => `/dashboard/${weddingId}`,
      overview: (weddingId: string) => `/dashboard/${weddingId}/overview`,
      invitation: (weddingId: string) => `/dashboard/${weddingId}/invitation`,
      rsvp: (weddingId: string) => `/dashboard/${weddingId}/rsvp`,
      media: (weddingId: string) => `/dashboard/${weddingId}/media`,
      settings: (weddingId: string) => `/dashboard/${weddingId}/settings`,
    },
  },
} as const;
