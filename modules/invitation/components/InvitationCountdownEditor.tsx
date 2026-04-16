'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { toDateTimeLocal } from '@/modules/weddings/util';
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
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { invitation_dashboard } from '../client-queries';
import {
  invitationCountdownFormSchema,
  type InvitationCountdownFormSchema,
} from '../schemas/invitation-countdown-form';

export type InvitationCountdownEditorProps = {
  weddingSlug: string;
  defaultValues: InvitationCountdownFormSchema;
};

export function InvitationCountdownEditor({
  weddingSlug,
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
    }));

    await saveMutation.mutateAsync({
      weddingSlug,
      countdownEvents,
    });
    router.refresh();
    toast.success('Kaydedildi');
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Geri sayım etkinlikleri</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Herkese açık sayfadaki geri sayım kartları. En fazla{' '}
        {COUNTDOWN_EVENTS_MAX} etkinlik; bölüm yalnızca en az bir etkinlik
        varken görünür (görünürlük ayarlardan da açık olmalıdır).
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormItem className="gap-3">
            <div className="mt-4 grid gap-6">
              {countdownFieldArray.fields.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Henüz etkinlik yok. Geri sayım bölümü yalnızca en az bir
                  etkinlik eklediğinizde görünür.
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
                        <FormLabel>Alt satır (isteğe bağlı)</FormLabel>
                        <FormDescription>
                          Örn. şehir, mekân veya kısa açıklama.
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="Elazığ · Kral Palace"
                            {...field}
                          />
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
                    })
                  }
                >
                  Etkinlik ekle
                </Button>
              )}
            </div>
          </FormItem>

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
