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
import { Input } from '@/components/ui/Input';
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
  HERO_EYEBROW_DEFAULT,
  HERO_TAGLINE_DEFAULT,
} from '@/modules/invitation/constants';
import { invitation_dashboard } from '../client-queries';
import {
  invitationCoverFormSchema,
  type InvitationCoverFormSchema,
} from '../schemas/invitation-cover-form';

export type InvitationCoverPageEditorProps = {
  weddingSlug: string;
  weddingId: string;
  defaultValues: InvitationCoverFormSchema;
  invitationSettingsReady: boolean;
};

export function InvitationCoverPageEditor({
  weddingSlug,
  weddingId,
  defaultValues,
  invitationSettingsReady,
}: InvitationCoverPageEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateCover(),
  );

  const form = useForm<InvitationCoverFormSchema>({
    resolver: zodResolver(invitationCoverFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

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

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      weddingSlug,
      partner1Name: data.partner1Name,
      partner2Name: data.partner2Name,
      heroImageUri: data.heroImageUri,
      heroEyebrow: (data.heroEyebrow ?? '').trim(),
      heroTagline: (data.heroTagline ?? '').trim(),
      heroDateLine: (data.heroDateLine ?? '').trim(),
    });

    router.refresh();

    toast.success('Kaydedildi');
  });

  return (
    <div className="space-y-12">
      {!invitationSettingsReady && (
        <p className="text-muted-foreground max-w-xl text-sm">
          Şablon ayarları geçici olarak kullanılamıyor; kapak kaydı şu an sorun
          çıkarabilir.
        </p>
      )}

      <section className="max-w-xl">
        <h2 className="text-lg font-semibold">Kapak ve çift bilgileri</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Çift isimleri ve kapak görseli/metinleri tek kayıtta gider. Tarih ve
          mekânlar Etkinlik detayları sayfasından eklenir.
        </p>

        <Form {...form}>
          <form className="mt-6 grid gap-6" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="partner1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner 1</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partner2Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner 2</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="heroEyebrow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Üst satır</FormLabel>
                  <FormDescription>
                    Kısa davet cümlesi (en fazla 64 karakter). Boş bırakırsanız:{' '}
                    «{HERO_EYEBROW_DEFAULT}»
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder={HERO_EYEBROW_DEFAULT}
                      maxLength={64}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroTagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vurgu satırı</FormLabel>
                  <FormDescription>
                    İsimlerin altındaki italik kısa metin (en fazla 64
                    karakter). Boş bırakırsanız: «{HERO_TAGLINE_DEFAULT}»
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder={HERO_TAGLINE_DEFAULT}
                      maxLength={64}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heroDateLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarih ve saat satırı</FormLabel>
                  <FormDescription>
                    Kapaktaki tarih/saat metni (en fazla 120 karakter). Boş
                    bırakırsanız, etkinliklerdeki en erken tarih/saatten
                    üretilir.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Örn. Cumartesi, 15 Haziran 2026 · 18:00"
                      maxLength={120}
                      autoComplete="off"
                    />
                  </FormControl>
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
      </section>
    </div>
  );
}
