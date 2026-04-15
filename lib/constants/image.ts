export const IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/svg+xml',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/gif',
] as const;

export type MimeType = (typeof IMAGE_ALLOWED_MIME_TYPES)[number];

/** UI-side guard (Supabase bucket limit is separate). */
export const IMAGE_MAX_SIZE_MB = 10;
