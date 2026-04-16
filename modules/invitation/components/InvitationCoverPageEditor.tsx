'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
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
import { EditWeddingForm } from '@/modules/weddings/components/EditWeddingForm';
import type { EditWeddingFormProps } from '@/modules/weddings/components/EditWeddingForm';
import { invitation_dashboard } from '../client-queries';
import {
  invitationCoverFormSchema,
  type InvitationCoverFormSchema,
} from '../schemas/invitation-cover-form';

export type InvitationCoverPageEditorProps = {
  weddingSlug: string;
  weddingId: string;
  weddingDefaults: EditWeddingFormProps['defaultValues'];
  coverDefaults: InvitationCoverFormSchema;
  invitationSettingsReady: boolean;
};

export function InvitationCoverPageEditor({
  weddingSlug,
  weddingId,
  weddingDefaults,
  coverDefaults,
  invitationSettingsReady,
}: InvitationCoverPageEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(invitation_dashboard.mutations.updateCover());

  const form = useForm<InvitationCoverFormSchema>({
    resolver: zodResolver(invitationCoverFormSchema),
    defaultValues: coverDefaults,
  });

  useEffect(() => {
    form.reset(coverDefaults);
  }, [coverDefaults, form]);

  const heroImageUriRaw = useWatch({
    control: form.control,
    name: 'heroImageUri',
  });
  const heroImageUri = (heroImageUriRaw ?? '').trim();

  const heroPreviewUrl = useMemo(() => {
    if (!heroImageUri) return '';
    return getPublicInvitationImageUrl(heroImageUri, {
      render: true,
      width: 1600,
      quality: 85,
    });
  }, [heroImageUri]);

  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const heroUpload = useSupabaseStorageUpload({
    bucket: BucketNames.DigitalInvitationImages,
    allowedMimeTypes: IMAGE_ALLOWED_MIME_TYPES,
    maxSizeMB: IMAGE_MAX_SIZE_MB,
    oldPath: heroImageUri || undefined,
    path: ({ extension, timestamp }) =>
      `weddings/${weddingId}/hero-${timestamp}.${extension}`,
    onSuccess: async ({ uploadedPath }) => {
      form.setValue('heroImageUri', uploadedPath, {
        shouldDirty: true,
        shouldTouch: true,
      });
      toast.success('Kapak görseli yüklendi');
    },
    onInvalidMimeType: () => toast.error('Geçersiz dosya türü'),
    onMaxSizeExceeded: ({ maxSizeMB }) =>
      toast.error(`Maksimum dosya boyutu: ${maxSizeMB}MB`),
    onUploadError: ({ errorMessage }) =>
      toast.error(errorMessage || 'Yükleme başarısız'),
  });

  const removeHero = async () => {
    if (!heroImageUri) return;
    const { error } = await ClientStorageService.remove(
      BucketNames.DigitalInvitationImages,
      [heroImageUri],
    );
    if (error) {
      toast.error('Dosya silinemedi (policy kontrol edin).');
      return;
    }
    form.setValue('heroImageUri', undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const submitCover = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      weddingSlug,
      heroImageUri: data.heroImageUri,
    });
    router.refresh();
    toast.success('Kapak kaydedildi');
  });

  return (
    <div className="space-y-12">
      <section className="max-w-xl space-y-2">
        <h2 className="text-lg font-semibold">Düğün bilgileri</h2>
        <p className="text-muted-foreground text-sm">
          İsimler, tarih ve yer; herkese açık davetiyede görünür.
        </p>
        <EditWeddingForm
          weddingSlug={weddingSlug}
          defaultValues={weddingDefaults}
        />
      </section>

      {!invitationSettingsReady && (
        <p className="text-muted-foreground max-w-xl text-sm">
          Şablon ayarları geçici olarak kullanılamıyor; kapak görseli
          kaydetmek şu an sorun çıkarabilir.
        </p>
      )}

      <section className="max-w-xl">
        <h2 className="text-lg font-semibold">Kapak görseli</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Davetiyenin en üst bölümündeki arka plan görseli. Hangi blokların
          görüneceğini Ayarlar sayfasından yönetirsiniz.
        </p>

        <Form {...form}>
          <form className="mt-6 grid gap-6" onSubmit={submitCover}>
            <FormField
              control={form.control}
              name="heroImageUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Görsel</FormLabel>
                  <FormDescription>
                    Görünürlük kapalıysa Ayarlar sayfasından açılabilir.
                  </FormDescription>
                  <FormControl>
                    <div className="grid gap-3">
                      <input type="hidden" {...field} value={heroImageUri} />

                      {heroPreviewUrl && (
                        <ImagePreviewWithActions
                          className="max-w-2xl"
                          src={heroPreviewUrl}
                          alt="Kapak önizleme"
                          disabled={heroUpload.isPending}
                          onRemove={removeHero}
                          onReplace={() => heroFileInputRef.current?.click()}
                        />
                      )}

                      <UploadImageWithCrop
                        ref={heroFileInputRef}
                        cropType="square"
                        aspectRatio={16 / 9}
                        minWidth={1600}
                        minHeight={900}
                        disabled={heroUpload.isPending}
                        onImageCropped={(file) => heroUpload.mutate(file)}
                        className={heroPreviewUrl ? 'hidden' : undefined}
                      />

                      {heroUpload.isPending && (
                        <span className="text-muted-foreground text-sm">
                          Yükleniyor…
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={saveMutation.isPending}>
              Kapak görselini kaydet
              {saveMutation.isPending && <LoadingSpinner />}
            </Button>

            {saveMutation.error && (
              <div className="text-destructive text-sm">
                {saveMutation.error.message}
              </div>
            )}
          </form>
        </Form>
      </section>
    </div>
  );
}
