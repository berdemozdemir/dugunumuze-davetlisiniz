import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';

export const BucketNames = {
  DigitalInvitationImages: 'digital-invitation-images',
  DigitalInvitationAudio: 'digital-invitation-audio',
} as const;

export type BucketName = (typeof BucketNames)[keyof typeof BucketNames];

const supabase = createSupabaseBrowserClient();

const isDev = process.env.NODE_ENV === 'development';

export function removeFromBucket(bucket: BucketName, paths: string[]) {
  return supabase.storage.from(bucket).remove(paths);
}

/**
 * Oturumlu kullanıcı ile Storage’a yükleme. İsteğe bağlı `oldFilePath` önce silinir.
 * DB’de saklanacak değer URL değil, `uploadResult.path` (bucket içi path).
 */
export async function uploadFileToBucket(
  bucket: BucketName,
  newFilePath: string,
  file: File,
  oldFilePath?: string | null,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError };
  }
  if (!user) {
    return {
      error: new Error(
        'Supabase oturumu yok (JWT). Sayfayı yenileyip tekrar giriş yapın; tarayıcıda çerezlerin engellenmediğinden emin olun.',
      ),
    };
  }

  const normalizedPath = newFilePath.replace(/^\/+/, '');

  if (isDev) {
    console.log('[storage upload]', {
      supabaseUserId: user.id,
      normalizedPath,
      bucket,
    });
  }

  if (oldFilePath) {
    const trimmedOld = oldFilePath.replace(/^\/+/, '');
    const { data: deleteData, error: deleteError } = await removeFromBucket(
      bucket,
      [trimmedOld],
    );
    if (deleteError || !deleteData) {
      return { error: deleteError ?? new Error('Delete failed') };
    }
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(normalizedPath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError || !uploadData) {
    if (isDev && uploadError) {
      console.error('[storage upload error]', uploadError);
    }
    return { error: uploadError ?? new Error('Upload failed') };
  }

  return { uploadResult: { path: uploadData.path } };
}

/** Tarayıcı Storage işlemleri (JWT + RLS). */
export const ClientStorageService = {
  remove: removeFromBucket,
  uploadFile: uploadFileToBucket,
} as const;
