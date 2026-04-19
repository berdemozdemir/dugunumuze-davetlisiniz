'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import {
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
  TOAST_REMEMBER_SAVE_SUFFIX,
} from '@/modules/invitation/constants';
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
import { invitation_dashboard } from '../client-queries';
import {
  invitationStoryTextFormSchema,
  type InvitationStoryTextFormSchema,
} from '../schemas/invitation-story-text-form';
import { paths } from '@/lib/paths';

export type InvitationStoryTextEditorProps = {
  eventSlug: string;
  eventId: string;
  defaultValues: InvitationStoryTextFormSchema;
};

export function InvitationStoryTextEditor({
  eventSlug,
  eventId,
  defaultValues,
}: InvitationStoryTextEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateStoryText(),
  );

  const form = useForm<InvitationStoryTextFormSchema>({
    resolver: zodResolver(invitationStoryTextFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const storyImageUriRaw = useWatch({
    control: form.control,
    name: 'storyImageUri',
  });
  const storyImageUri = (storyImageUriRaw ?? '').trim();

  const storyPreviewUrl = useMemo(() => {
    if (!storyImageUri) return '';
    return getPublicInvitationImageUrl(storyImageUri, {
      render: true,
      width: 1600,
      quality: 85,
    });
  }, [storyImageUri]);

  const storyFileInputRef = useRef<HTMLInputElement>(null);

  const storyUpload = useSupabaseStorageUpload({
    bucket: BucketNames.DigitalInvitationImages,
    allowedMimeTypes: IMAGE_ALLOWED_MIME_TYPES,
    maxSizeMB: IMAGE_MAX_SIZE_MB,
    oldPath: storyImageUri || undefined,
    path: ({ extension, timestamp }) =>
      `events/${eventId}/story-${timestamp}.${extension}`,
    onSuccess: async ({ uploadedPath }) => {
      form.setValue('storyImageUri', uploadedPath, {
        shouldDirty: true,
        shouldTouch: true,
      });
      toast.success(`Hikâye görseli yüklendi${TOAST_REMEMBER_SAVE_SUFFIX}`);
    },
    onInvalidMimeType: () => toast.error('Geçersiz dosya türü'),
    onMaxSizeExceeded: ({ maxSizeMB }) =>
      toast.error(`Maksimum dosya boyutu: ${maxSizeMB}MB`),
    onUploadError: ({ errorMessage }) =>
      toast.error(errorMessage || 'Yükleme başarısız'),
  });

  const removeStoryImage = async () => {
    if (!storyImageUri) return;
    const { error } = await ClientStorageService.remove(
      BucketNames.DigitalInvitationImages,
      [storyImageUri],
    );
    if (error) {
      toast.error('Dosya silinemedi (policy kontrol edin).');
      return;
    }
    form.setValue('storyImageUri', undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
    toast.success(`Hikâye görseli kaldırıldı${TOAST_REMEMBER_SAVE_SUFFIX}`);
  };

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      eventSlug,
      storyHeadline: data.storyHeadline,
      storySubline: data.storySubline,
      storyImageUri: data.storyImageUri,
    });

    toast.success('Kaydedildi');

    router.push(paths.dashboard.event.closing(eventSlug));
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Hikâye metni</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Hikâye bölümündeki arka plan görseli, başlık ve alt metin. İsimler Kapak
        sayfasından; tarih ve mekânlar Etkinlik detayları sayfasından gelir.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormField
            control={form.control}
            name="storyImageUri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hikâye görseli</FormLabel>
                <FormDescription>
                  Boş bırakırsanız varsayılan görsel kullanılır. Görünürlük
                  kapalıysa Ayarlar sayfasından açılabilir.
                </FormDescription>
                <FormControl>
                  <div className="grid gap-3">
                    <input type="hidden" {...field} value={storyImageUri} />

                    {storyPreviewUrl && (
                      <ImagePreviewWithActions
                        className="max-w-2xl"
                        src={storyPreviewUrl}
                        alt="Hikâye önizleme"
                        disabled={storyUpload.isPending}
                        onRemove={removeStoryImage}
                        onReplace={() => storyFileInputRef.current?.click()}
                      />
                    )}

                    <UploadImageWithCrop
                      ref={storyFileInputRef}
                      cropType="square"
                      aspectRatio={16 / 9}
                      minWidth={1600}
                      minHeight={900}
                      disabled={storyUpload.isPending}
                      onImageCropped={(file) => storyUpload.mutate(file)}
                      className={storyPreviewUrl ? 'hidden' : undefined}
                    />

                    {storyUpload.isPending && (
                      <span className="text-muted-foreground flex items-center gap-2 text-sm">
                        Yükleniyor… <LoadingSpinner />
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storyHeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hikâye başlığı</FormLabel>

                <FormDescription>
                  Boş bırakırsanız varsayılan metin gösterilir.
                </FormDescription>

                <FormControl>
                  <Textarea placeholder={STORY_HEADLINE_DEFAULT} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storySubline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hikâye alt metni</FormLabel>
                <FormDescription>
                  Başlığın altındaki ince satır. Boş bırakırsanız varsayılan
                  gösterilir.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder={STORY_SUBLINE_DEFAULT} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!form.formState.isDirty || saveMutation.isPending}
          >
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
