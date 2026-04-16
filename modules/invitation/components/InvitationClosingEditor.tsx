'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ImagePreviewWithActions } from '@/components/ImagePreviewWithActions';
import { UploadImageWithCrop } from '@/components/UploadImageWithCrop';
import {
  BucketNames,
  ClientStorageService,
} from '@/integrations/supabase/supabase-storage';
import { useSupabaseStorageUpload } from '@/lib/hooks/useSupabaseStorageUpload';
import { IMAGE_ALLOWED_MIME_TYPES, IMAGE_MAX_SIZE_MB } from '@/lib/constants';
import { getPublicInvitationImageUrl } from '@/lib/supabase/public-image-url';
import {
  CLOSING_NOTE_DEFAULT,
  CLOSING_QUOTE_DEFAULT,
} from '@/modules/invitation/constants';
import { invitation_dashboard } from '../client-queries';
import {
  invitationClosingFormSchema,
  type InvitationClosingFormSchema,
} from '../schemas/invitation-closing-form';

export type InvitationClosingEditorProps = {
  weddingSlug: string;
  weddingId: string;
  defaultValues: InvitationClosingFormSchema;
};

export function InvitationClosingEditor({
  weddingSlug,
  weddingId,
  defaultValues,
}: InvitationClosingEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(invitation_dashboard.mutations.updateClosing());

  const form = useForm<InvitationClosingFormSchema>({
    resolver: zodResolver(invitationClosingFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const closingPaths =
    useWatch({ control: form.control, name: 'closingPhotoUris' }) ?? [];

  const closingCropTarget = useRef<'append' | number>('append');
  const replaceOldClosingPhotoPathRef = useRef<string | undefined>(undefined);
  const closingGalleryFileRef = useRef<HTMLInputElement>(null);

  const closingGalleryUpload = useSupabaseStorageUpload({
    bucket: BucketNames.DigitalInvitationImages,
    allowedMimeTypes: IMAGE_ALLOWED_MIME_TYPES,
    maxSizeMB: IMAGE_MAX_SIZE_MB,
    path: ({ extension, timestamp }) =>
      `weddings/${weddingId}/closing-${timestamp}.${extension}`,
    onSuccess: async ({ uploadedPath }) => {
      const target = closingCropTarget.current;
      if (target === 'append') {
        const cur = form.getValues('closingPhotoUris') ?? [];
        if (cur.length >= 10) {
          toast.error('En fazla 10 fotoğraf ekleyebilirsiniz.');
          return;
        }
        form.setValue('closingPhotoUris', [...cur, uploadedPath], {
          shouldDirty: true,
          shouldTouch: true,
        });
        toast.success('Fotoğraf eklendi');
      } else {
        const oldP = replaceOldClosingPhotoPathRef.current;
        replaceOldClosingPhotoPathRef.current = undefined;
        form.setValue(`closingPhotoUris.${target}`, uploadedPath, {
          shouldDirty: true,
          shouldTouch: true,
        });
        if (oldP) {
          const { error } = await ClientStorageService.remove(
            BucketNames.DigitalInvitationImages,
            [oldP],
          );
          if (error) {
            toast.error(
              'Eski görsel depodan silinemedi; yeni görsel yine kaydedildi.',
            );
          }
        }
        toast.success('Fotoğraf güncellendi');
      }
    },
    onInvalidMimeType: () => toast.error('Geçersiz dosya türü'),
    onMaxSizeExceeded: ({ maxSizeMB }) =>
      toast.error(`Maksimum dosya boyutu: ${maxSizeMB}MB`),
    onUploadError: ({ errorMessage }) =>
      toast.error(errorMessage || 'Yükleme başarısız'),
  });

  const removeClosingPhotoAt = async (index: number) => {
    const path = form.getValues(`closingPhotoUris.${index}`)?.trim();
    if (path) {
      const { error } = await ClientStorageService.remove(
        BucketNames.DigitalInvitationImages,
        [path],
      );
      if (error) {
        toast.error('Dosya silinemedi (policy kontrol edin).');
        return;
      }
    }
    const next = (form.getValues('closingPhotoUris') ?? []).filter(
      (_, i) => i !== index,
    );
    form.setValue('closingPhotoUris', next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      weddingSlug,
      quote: data.quote,
      closingNote: data.closingNote,
      closingPhotoUris: data.closingPhotoUris,
    });
    router.refresh();
    toast.success('Kaydedildi');
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Kapanış</h2>

      <p className="text-muted-foreground mt-1 text-sm">
        Alıntı, kapanış notu ve fotoğraf galerisi. Görünürlük ayarlardan
        yönetilir.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-8" onSubmit={submit}>
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alıntı metni</FormLabel>
                <FormDescription>
                  Kapanış bölümündeki tırnaklı söz. Boş bırakırsanız varsayılan
                  gösterilir.
                </FormDescription>

                <FormControl>
                  <Textarea placeholder={CLOSING_QUOTE_DEFAULT} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="closingNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kapanış notu</FormLabel>
                <FormDescription>
                  Alıntının hemen altındaki kısa paragraf. Boş bırakırsanız
                  varsayılan gösterilir.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder={CLOSING_NOTE_DEFAULT} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="closingPhotoUris"
            render={() => (
              <FormItem>
                <FormLabel>Kapanış fotoğraf galerisi</FormLabel>
                <FormDescription>
                  En fazla 10 görsel; kapanış bölümünün üstünde kaydırmalı
                  galeri olarak gösterilir.
                </FormDescription>

                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {closingPaths.map((pathRaw, index) => {
                    const path = (pathRaw ?? '').trim();
                    return (
                      path && (
                        <div key={`${path}-${index}`} className="min-w-0">
                          <ImagePreviewWithActions
                            className="w-full max-w-none"
                            aspectClassName="aspect-[3/4]"
                            src={getPublicInvitationImageUrl(path, {
                              render: true,
                              width: 900,
                              quality: 85,
                            })}
                            alt={`Kapanış fotoğrafı ${index + 1}`}
                            disabled={closingGalleryUpload.isPending}
                            onRemove={() => void removeClosingPhotoAt(index)}
                            onReplace={() => {
                              closingCropTarget.current = index;
                              closingGalleryFileRef.current?.click();
                            }}
                          />
                        </div>
                      )
                    );
                  })}
                </div>

                {closingPaths.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    disabled={closingGalleryUpload.isPending}
                    onClick={() => {
                      closingCropTarget.current = 'append';
                      closingGalleryFileRef.current?.click();
                    }}
                  >
                    Fotoğraf ekle
                  </Button>
                )}

                <UploadImageWithCrop
                  ref={closingGalleryFileRef}
                  className="hidden"
                  cropType="square"
                  aspectRatio={3 / 4}
                  minWidth={900}
                  minHeight={1200}
                  disabled={closingGalleryUpload.isPending}
                  onImageCropped={(file) => {
                    const target = closingCropTarget.current;
                    if (target === 'append') {
                      if (
                        (form.getValues('closingPhotoUris') ?? []).length >= 10
                      ) {
                        toast.error('En fazla 10 fotoğraf ekleyebilirsiniz.');
                        return;
                      }
                      closingGalleryUpload.mutate(file);
                      return;
                    }
                    replaceOldClosingPhotoPathRef.current =
                      form.getValues(`closingPhotoUris.${target}`)?.trim() ||
                      undefined;
                    closingGalleryUpload.mutate(file);
                  }}
                />

                {closingGalleryUpload.isPending && (
                  <div className="mt-3 flex justify-center" aria-busy="true">
                    <LoadingSpinner />
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={saveMutation.isPending}>
            Kaydet
            {saveMutation.isPending && <LoadingSpinner />}
          </Button>

          {saveMutation.error && (
            <div className="text-destructive text-sm">
              {saveMutation.error.message}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
