'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  BucketNames,
  ClientStorageService,
} from '@/integrations/supabase/supabase-storage';
import { useSupabaseStorageUpload } from '@/lib/hooks/useSupabaseStorageUpload';
import { AUDIO_ALLOWED_MIME_TYPES, AUDIO_MAX_SIZE_MB } from '@/lib/constants';
import { getPublicInvitationAudioUrl } from '@/lib/supabase/public-image-url';
import { invitation_dashboard } from '../client-queries';
import {
  invitationMediaFormSchema,
  type InvitationMediaFormSchema,
} from '../schemas/invitation-media-form';
import { clampTrimSecondsToDuration, normalizeTrim } from '../util';
import { InvitationTemplateWarning } from './InvitationTemplateWarning';
import { MusicTrackFileControls } from './MusicTrackFileControls';
import { TrackDurationHint } from './TrackDurationHint';
import {
  parseOptionalTrimSecondsFromInput,
  resolveTrimUpperBoundForSubmit,
} from '../utils/media-trim-input';

export type InvitationMediaPageEditorProps = {
  eventSlug: string;
  eventId: string;
  mediaDefaults: InvitationMediaFormSchema;
  invitationSettingsReady: boolean;
};

export function InvitationMediaPageEditor({
  eventSlug,
  eventId,
  mediaDefaults,
  invitationSettingsReady,
}: InvitationMediaPageEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateMedia(),
  );

  const form = useForm<InvitationMediaFormSchema>({
    resolver: zodResolver(invitationMediaFormSchema),
    defaultValues: mediaDefaults,
  });

  useEffect(() => {
    form.reset(mediaDefaults);
  }, [mediaDefaults, form]);

  const musicTrackPathRaw = useWatch({
    control: form.control,
    name: 'musicTrackPath',
  });
  const musicTrackPath = (musicTrackPathRaw ?? '').trim();
  const hasMusicTrack = musicTrackPath.length > 0;

  const previewUrl = useMemo(() => {
    if (!hasMusicTrack) {
      return '';
    }
    return getPublicInvitationAudioUrl(musicTrackPath);
  }, [hasMusicTrack, musicTrackPath]);

  const [trackDurationSec, setTrackDurationSec] = useState<number | null>(null);

  useEffect(() => {
    if (!previewUrl) {
      setTrackDurationSec(null);
      return;
    }

    const audio = new Audio();
    audio.preload = 'metadata';

    const onMeta = () => {
      const d = audio.duration;
      if (Number.isFinite(d) && d > 0) {
        setTrackDurationSec(d);
      } else {
        setTrackDurationSec(null);
      }
    };

    const onErr = () => {
      setTrackDurationSec(null);
    };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('error', onErr);
    audio.src = previewUrl;

    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('error', onErr);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [previewUrl]);

  useEffect(() => {
    if (trackDurationSec === null || trackDurationSec <= 0) {
      return;
    }
    const start = form.getValues('musicTrimStartSec');
    const end = form.getValues('musicTrimEndSec');
    const cs = clampTrimSecondsToDuration(start, trackDurationSec);
    const ce = clampTrimSecondsToDuration(end, trackDurationSec);
    if (cs !== start) {
      form.setValue('musicTrimStartSec', cs, { shouldDirty: true });
    }
    if (ce !== end) {
      form.setValue('musicTrimEndSec', ce, { shouldDirty: true });
    }
  }, [trackDurationSec, form]);

  const musicUpload = useSupabaseStorageUpload({
    bucket: BucketNames.DigitalInvitationAudio,
    allowedMimeTypes: AUDIO_ALLOWED_MIME_TYPES,
    maxSizeMB: AUDIO_MAX_SIZE_MB,
    oldPath: musicTrackPath || undefined,
    path: ({ extension, timestamp }) =>
      `events/${eventId}/music-${timestamp}.${extension}`,
    onSuccess: async ({ uploadedPath }) => {
      form.setValue('musicTrackPath', uploadedPath, {
        shouldDirty: true,
        shouldTouch: true,
      });
      toast.success('Müzik yüklendi; kaydetmeyi unutmayın');
    },
    onInvalidMimeType: () => toast.error('Desteklenen türler: MP3, M4A, WAV'),
    onMaxSizeExceeded: ({ maxSizeMB }) =>
      toast.error(`Maksimum dosya boyutu: ${maxSizeMB}MB`),
    onUploadError: ({ errorMessage }) =>
      toast.error(errorMessage || 'Yükleme başarısız'),
  });

  const removeMusic = async () => {
    if (!musicTrackPath) {
      return;
    }
    const { error } = await ClientStorageService.remove(
      BucketNames.DigitalInvitationAudio,
      [musicTrackPath],
    );
    if (error) {
      toast.error('Dosya silinemedi (policy kontrol edin).');
      return;
    }
    form.setValue('musicTrackPath', undefined, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue('musicTrimStartSec', undefined, { shouldDirty: true });
    form.setValue('musicTrimEndSec', undefined, { shouldDirty: true });
    toast.success('Müzik kaldırıldı; kaydetmeyi unutmayın');
  };

  let trimMaxSec: number | undefined;
  if (trackDurationSec !== null && trackDurationSec > 0) {
    trimMaxSec = trackDurationSec;
  } else {
    trimMaxSec = undefined;
  }

  const submit = form.handleSubmit(async (data) => {
    const upper = resolveTrimUpperBoundForSubmit(trimMaxSec);
    const pathTrimmed = data.musicTrackPath?.trim() ?? '';
    const patch: InvitationMediaFormSchema = {
      musicTrackPath: pathTrimmed.length > 0 ? pathTrimmed : undefined,
      musicTrimStartSec: clampTrimSecondsToDuration(
        normalizeTrim(data.musicTrimStartSec),
        upper,
      ),
      musicTrimEndSec: clampTrimSecondsToDuration(
        normalizeTrim(data.musicTrimEndSec),
        upper,
      ),
    };
    await saveMutation.mutateAsync({
      eventSlug,
      ...patch,
    });
    router.refresh();
    toast.success('Müzik ayarları kaydedildi');
  });

  const showDurationHint = hasMusicTrack && previewUrl.length > 0;

  return (
    <div className="space-y-12">
      <InvitationTemplateWarning visible={!invitationSettingsReady} />

      <section className="max-w-xl">
        <h2 className="text-lg font-semibold">Müzik</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Davetiye sayfasındaki müzik çalar bu dosyayı kullanır. Kesme yalnızca
          oynatma sırasında uygulanır; yüklenen dosya değişmez.
        </p>

        <Form {...form}>
          <form className="mt-6 grid gap-6" onSubmit={submit}>
            <FormField
              control={form.control}
              name="musicTrackPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosya</FormLabel>
                  <FormDescription>
                    En fazla {AUDIO_MAX_SIZE_MB}MB. MP3, M4A veya WAV.
                  </FormDescription>
                  <FormControl>
                    <div className="grid gap-3">
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ?? ''}
                      />

                      <MusicTrackFileControls
                        hasTrack={hasMusicTrack}
                        previewUrl={previewUrl}
                        isUploading={musicUpload.isPending}
                        onOpenFilePicker={() => fileInputRef.current?.click()}
                        onRemoveTrack={() => void removeMusic()}
                      />

                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept={AUDIO_ALLOWED_MIME_TYPES.join(',')}
                        disabled={musicUpload.isPending}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = '';
                          if (file) {
                            musicUpload.mutate(file);
                          }
                        }}
                      />

                      {musicUpload.isPending && (
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

            <TrackDurationHint
              show={showDurationHint}
              trimMaxSec={trimMaxSec}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="musicTrimStartSec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlangıç (sn)</FormLabel>
                    <FormDescription className="text-xs">
                      Boş bırakırsanız dosyanın başından.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={trimMaxSec}
                        placeholder="Örn. 5"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(
                            parseOptionalTrimSecondsFromInput(
                              e.target.value,
                              trimMaxSec,
                            ),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="musicTrimEndSec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bitiş (sn)</FormLabel>
                    <FormDescription className="text-xs">
                      Boş bırakırsanız dosyanın sonuna kadar.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={trimMaxSec}
                        placeholder="Örn. 120"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(
                            parseOptionalTrimSecondsFromInput(
                              e.target.value,
                              trimMaxSec,
                            ),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={saveMutation.isPending}>
              Kaydet
              {saveMutation.isPending ? <LoadingSpinner /> : null}
            </Button>

            {saveMutation.error ? (
              <div className="text-destructive text-sm">
                {saveMutation.error.message ?? 'Kayıt başarısız'}
              </div>
            ) : null}
          </form>
        </Form>
      </section>
    </div>
  );
}
