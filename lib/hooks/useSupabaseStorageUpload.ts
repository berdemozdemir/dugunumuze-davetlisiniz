'use client';

import { useMutation } from '@tanstack/react-query';
import { okOrThrow, err, ok } from '@/lib/result';
import type { MimeType } from '@/lib/constants';
import { getFileType } from '@/lib/utils';
import { ClientStorageService, type BucketName } from '@/integrations/supabase/supabase-storage';

export type UseSupabaseStorageUploadOptions = {
  bucket: BucketName;
  allowedMimeTypes?: readonly MimeType[];
  maxSizeMB?: number;
  oldPath?: string;
  path: (args: { file: File; extension: string; timestamp: number }) => string;
  onSuccess: (args: { uploadedPath: string }) => Promise<void> | void;
  onError?: (error: unknown) => void;
  onFileError?: () => void;
  onInvalidMimeType?: (args: { mimeType: string | undefined }) => void;
  onMaxSizeExceeded?: (args: { maxSizeMB: number }) => void;
  onUploadError?: (args: { errorMessage: string }) => void;
};

export function useSupabaseStorageUpload(opts: UseSupabaseStorageUploadOptions) {
  const mutation = useMutation({
    mutationFn: (file?: File) => uploadFile({ file, opts }).then(okOrThrow),
    onSuccess: (data) => {
      void opts.onSuccess(data);
    },
    onError: (e: unknown) => {
      opts.onError?.(e);
    },
  });

  return mutation;
}

async function uploadFile({
  file,
  opts,
}: {
  file?: File;
  opts: UseSupabaseStorageUploadOptions;
}) {
  if (!file) {
    opts.onFileError?.();
    return err({ reason: 'no-file-provided', message: 'No file provided' });
  }

  const extension = getFileType(file.name);
  if (!extension) {
    opts.onInvalidMimeType?.({ mimeType: file.type });
    return err({ reason: 'file-with-no-extension', message: 'File has no extension' });
  }

  const isValidMimeType = opts.allowedMimeTypes?.length
    ? opts.allowedMimeTypes.includes(file.type as MimeType)
    : true;
  if (!isValidMimeType) {
    opts.onInvalidMimeType?.({ mimeType: file.type });
    return err({ reason: 'invalid-mime-type', message: 'Invalid mime type' });
  }

  if (opts.maxSizeMB !== undefined) {
    const maxBytes = opts.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      opts.onMaxSizeExceeded?.({ maxSizeMB: opts.maxSizeMB });
      return err({ reason: 'exceeds-max-limit', message: 'File size exceeds the maximum limit' });
    }
  }

  const newPath = opts.path({
    file,
    extension,
    timestamp: new Date().getTime(),
  });

  const { error, uploadResult } = await ClientStorageService.uploadFile(
    opts.bucket,
    newPath,
    file,
    opts.oldPath,
  );

  if (error || !uploadResult) {
    const msg =
      error !== null &&
      error !== undefined &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Failed to upload file';
    opts.onUploadError?.({ errorMessage: msg });
    return err({ reason: 'supabase-upload-failed', message: msg });
  }

  return ok({ uploadedPath: uploadResult.path });
}
