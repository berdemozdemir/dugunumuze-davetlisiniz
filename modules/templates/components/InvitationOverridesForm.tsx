'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { InvitationDefaults } from '../types';
import { service_templates } from '../client-queries';
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Checkbox } from '@/components/ui/Checkbox';
import { INVITATION_SECTION_OPTIONS } from '../constants/invitation-section-options';
import {
  InvitationOverridesFormSchema,
  invitationOverridesSchema,
} from '../schemas/invitation-overrides';
import {
  CLOSING_NOTE_DEFAULT,
  CLOSING_QUOTE_DEFAULT,
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
} from '@/modules/invitation/constants';
import { ImagePreviewWithActions } from '@/components/ImagePreviewWithActions';
import { UploadImageWithCrop } from '@/components/UploadImageWithCrop';
import {
  BucketNames,
  ClientStorageService,
} from '@/integrations/supabase/supabase-storage';
import { useSupabaseStorageUpload } from '@/lib/hooks/useSupabaseStorageUpload';
import { IMAGE_ALLOWED_MIME_TYPES, IMAGE_MAX_SIZE_MB } from '@/lib/constants';
import { getPublicInvitationImageUrl } from '@/lib/supabase/public-image-url';

type Props = {
  weddingSlug: string;
  weddingId: string;
  merged: InvitationDefaults;
};

// TODO: this and below form should not submit if the form is not dirty
export function InvitationOverridesForm({
  weddingSlug,
  weddingId,
  merged,
}: Props) {
  const saveMutation = useMutation(
    service_templates.mutations.updateWeddingInvitationOverrides(),
  );

  const form = useForm<InvitationOverridesFormSchema>({
    resolver: zodResolver(invitationOverridesSchema),
    defaultValues: {
      heroImageUri: merged.heroImageUri?.trim() || undefined,
      quote: merged.quote ?? '',
      storyHeadline: merged.storyHeadline ?? '',
      storySubline: merged.storySubline ?? '',
      closingNote: merged.closingNote ?? '',
      closingPhotoUris: (merged.closingPhotoUris ?? [])
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 10),
      sections: {
        hero: merged.sections?.hero ?? true,
        countdown: merged.sections?.countdown ?? true,
        story: merged.sections?.story ?? true,
        details: merged.sections?.details ?? true,
        closing: merged.sections?.closing ?? true,
        musicPlayer: merged.sections?.musicPlayer ?? true,
      },
    },
  });

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

      toast.success('Hero görseli yüklendi');
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
      overrides: data,
    });

    toast.success('Saved');
  });

  return (
    <div className="mt-16 max-w-xl">
      <h2 className="text-xl font-semibold">Template overrides</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Customize what appears on your public invitation page.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-8" onSubmit={submit}>
          <FormField
            control={form.control}
            name="heroImageUri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero görseli</FormLabel>
                <FormDescription>
                  Davetiyenin en üst bölümündeki arka plan görseli. Dosya seçip
                  kırpın; sonra kaydettiğinizde template override olarak
                  saklanır.
                </FormDescription>

                <FormControl>
                  <div className="grid gap-3">
                    <input type="hidden" {...field} value={heroImageUri} />

                    {heroPreviewUrl && (
                      <ImagePreviewWithActions
                        className="max-w-2xl"
                        src={heroPreviewUrl}
                        alt="Hero önizleme"
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
            name="storyHeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hikâye başlığı</FormLabel>
                <FormDescription>
                  Hikâye bölümündeki büyük başlık. Boş bırakırsanız örnekteki
                  varsayılan gösterilir.
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
                  Başlığın altındaki ince satır. Boş bırakırsanız örnekteki
                  varsayılan gösterilir.
                </FormDescription>

                <FormControl>
                  <Textarea placeholder={STORY_SUBLINE_DEFAULT} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alıntı</FormLabel>

                <FormDescription>
                  Kapanış bölümündeki tırnaklı söz. Boş bırakırsanız örnekteki
                  varsayılan gösterilir.
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
                  Kapanış bölümünde, alıntının hemen altındaki kısa paragraf;
                  çift isimlerden önce görünür. Boş bırakırsanız örnekteki
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
                  galeri olarak gösterilir. Hero ile aynı depolama alanına
                  yüklenir.
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
                      form
                        .getValues(`closingPhotoUris.${target}`)
                        ?.trim() || undefined;
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

          <FormItem className="gap-3">
            <FormLabel>Sections</FormLabel>

            <FormDescription>
              These toggles control which blocks are visible on your public
              invitation page. Turn a section off if you don&apos;t want it to
              appear.
            </FormDescription>

            <div className="grid gap-2">
              {INVITATION_SECTION_OPTIONS.map(({ key, label, description }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`sections.${key}`}
                  render={({ field }) => (
                    <FormItem className="border-input flex cursor-pointer items-start justify-between gap-3 rounded-lg border px-3 py-2">
                      <FormLabel className="cursor-pointer font-normal">
                        <span className="block text-sm">{label}</span>

                        <span className="text-muted-foreground block text-xs">
                          {description}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value !== false}
                          onCheckedChange={(next) =>
                            field.onChange(next === true)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormItem>

          <Button type="submit" disabled={saveMutation.isPending}>
            Save overrides
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
