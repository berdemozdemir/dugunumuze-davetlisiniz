'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { toDateTimeLocal } from '@/modules/events/util';
import { COUNTDOWN_EVENTS_MAX } from '@/modules/invitation/constants';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { invitation_dashboard } from '../client-queries';
import {
  invitationCountdownFormSchema,
  type InvitationCountdownFormSchema,
} from '../schemas/invitation-countdown-form';
import { paths } from '@/lib/paths';

export type InvitationCountdownEditorProps = {
  eventSlug: string;
  defaultValues: InvitationCountdownFormSchema;
};

export function InvitationCountdownEditor({
  eventSlug,
  defaultValues,
}: InvitationCountdownEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateCountdown(),
  );

  const form = useForm<InvitationCountdownFormSchema>({
    resolver: zodResolver(invitationCountdownFormSchema),
    defaultValues: {
      countdownEvents: defaultValues.countdownEvents ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      countdownEvents: defaultValues.countdownEvents ?? [],
    });
  }, [defaultValues, form]);

  const countdownFieldArray = useFieldArray({
    control: form.control,
    name: 'countdownEvents',
  });

  const submit = form.handleSubmit(async (data) => {
    const countdownEvents = (data.countdownEvents ?? []).map((row) => ({
      title: row.title.trim(),
      dateTime: new Date(row.dateTime).toISOString(),
      subtitle: row.subtitle?.trim() ? row.subtitle.trim() : undefined,
      venueName: row.venueName?.trim() ? row.venueName.trim() : undefined,
      addressText: row.addressText?.trim() ? row.addressText.trim() : undefined,
      city: row.city?.trim() ? row.city.trim() : undefined,
    }));

    await saveMutation.mutateAsync({
      eventSlug,
      countdownEvents,
    });

    toast.success('Kaydedildi');

    router.push(paths.dashboard.event.story(eventSlug));
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Etkinlik detayları</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Her etkinlik için tarih ve konum girin; aynı kayıt hem geri sayım hem
        davetiyedeki detay kartlarında kullanılır. En fazla{' '}
        {COUNTDOWN_EVENTS_MAX} etkinlik. Bölümler Ayarlardan açık olmalıdır.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormItem className="gap-3">
            <div className="mt-4 grid gap-6">
              {countdownFieldArray.fields.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Henüz etkinlik yok. Liste boşken geri sayım ve etkinlik
                  detayları bölümleri görünmez.
                </p>
              )}

              {countdownFieldArray.fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="border-input space-y-4 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      Etkinlik {index + 1}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => countdownFieldArray.remove(index)}
                    >
                      Kaldır
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn. Kına gecesi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.dateTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarih ve saat</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.subtitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Alt satır (geri sayım, isteğe bağlı)
                        </FormLabel>
                        <FormDescription>
                          Kısa not; geri sayım kartında görünür.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Örn. akşam 20:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.venueName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mekân adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Salon / otel adı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.addressText`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Sokak, mahalle, yön tarifi…"
                            className="min-h-[80px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`countdownEvents.${index}.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şehir (isteğe bağlı)</FormLabel>
                        <FormDescription>
                          {/* TODO: harita / adres otomatik doldurma */}
                          İleride haritadan seçim ile doldurulacak.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Örn. İstanbul" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {countdownFieldArray.fields.length < COUNTDOWN_EVENTS_MAX && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    countdownFieldArray.append({
                      title: 'Yeni etkinlik',
                      dateTime: toDateTimeLocal(new Date()),
                      subtitle: '',
                      venueName: '',
                      addressText: '',
                      city: '',
                    })
                  }
                >
                  Etkinlik ekle
                </Button>
              )}
            </div>
          </FormItem>

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
