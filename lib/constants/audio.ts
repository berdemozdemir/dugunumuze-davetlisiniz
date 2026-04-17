/** UI + `useSupabaseStorageUpload` guardı (Supabase bucket limiti ayrı). */
export const AUDIO_MAX_SIZE_MB = 10;

export const AUDIO_ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/aac',
  'audio/x-m4a',
  'audio/m4a',
] as const;
