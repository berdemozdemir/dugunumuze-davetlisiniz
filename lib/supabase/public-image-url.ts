import { BucketNames } from '@/integrations/supabase/supabase-storage';

/**
 * Supabase Storage **public** ve isteğe bağlı **render** URL üretimi.
 *
 * DB’de tam URL tutmuyoruz; sadece bucket içi **path** (örn. `events/<id>/hero.webp`).
 * Varsayılan: `/storage/v1/object/public/...` (her public bucket’ta çalışır).
 *
 * `/storage/v1/render/image/...` (resize/kalite) Supabase’te **Image Transformations**
 * gerektirir; planda yoksa veya free tier’da sık **403** verir. Açmak için:
 * `NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM=true` ve panelde özelliğin aktif olması gerekir.
 */
type PublicImageUrlOptions = {
  /** Use Supabase image render endpoint (resize). Ignored unless env transform is on. */
  render?: boolean;
  /** Only for render endpoint. */
  width?: number;
  /** Only for render endpoint. */
  height?: number;
  /** Only for render endpoint. */
  quality?: number;
};

function encodeStoragePath(path: string) {
  return path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

function getPublicStorageBucketUrl(
  bucket: string,
  path: string,
  opts: PublicImageUrlOptions = {},
) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return '';

  const clean = encodeStoragePath(path);

  if (!opts.render) {
    return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${clean}`;
  }

  const qs = new URLSearchParams();
  if (opts.width) qs.set('width', String(opts.width));
  if (opts.height) qs.set('height', String(opts.height));
  if (opts.quality) qs.set('quality', String(opts.quality));

  const q = qs.toString();
  return `${base}/storage/v1/render/image/public/${encodeURIComponent(bucket)}/${clean}${q ? `?${q}` : ''}`;
}

export function getPublicInvitationImageUrl(
  path: string,
  opts: PublicImageUrlOptions = {},
) {
  const transformEnabled =
    process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM === 'true';
  const useRender = transformEnabled && (opts.render ?? false);

  return getPublicStorageBucketUrl(BucketNames.DigitalInvitationImages, path, {
    ...opts,
    render: useRender,
  });
}

/** Public bucket `digital-invitation-audio`; path DB’de saklanan object path. */
export function getPublicInvitationAudioUrl(path: string) {
  return getPublicStorageBucketUrl(
    BucketNames.DigitalInvitationAudio,
    path,
    {},
  );
}
