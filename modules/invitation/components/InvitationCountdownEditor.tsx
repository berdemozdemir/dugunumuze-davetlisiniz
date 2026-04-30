'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { toDateTimeLocal } from '@/modules/events/util';
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

export type InvitationCountdownEditorProps = {
  eventSlug: string;
  defaultValues: InvitationCountdownFormSchema;
  onBack?: () => void;
  onSuccess?: () => void;
  submitLabel?: string;
  title?: string;
  description?: string;
};

export function InvitationCountdownEditor({
  eventSlug,
  defaultValues,
  onBack,
  onSuccess,
  submitLabel = 'Kaydet',
  title = 'Etkinlik detayları',
  description = 'Etkinlik için tarih ve konum girin; aynı kayıt hem geri sayım hem davetiyedeki detay kartlarında kullanılır.',
}: InvitationCountdownEditorProps) {
  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateCountdown(),
  );

  const emptyCountdownEvent = useMemo<
    NonNullable<InvitationCountdownFormSchema['countdownEvent']>
  >(
    () => ({
      title: 'Etkinlik',
      dateTime: toDateTimeLocal(new Date()),
      subtitle: '',
      venueName: '',
      addressText: '',
      city: '',
    }),
    [],
  );

  const form = useForm<InvitationCountdownFormSchema>({
    resolver: zodResolver(invitationCountdownFormSchema),
    defaultValues: {
      countdownEvent: defaultValues.countdownEvent ?? emptyCountdownEvent,
    },
  });

  useEffect(() => {
    form.reset({
      countdownEvent: defaultValues.countdownEvent ?? emptyCountdownEvent,
    });
  }, [defaultValues, emptyCountdownEvent, form]);

  const submit = form.handleSubmit(async (data) => {
    const row = data.countdownEvent;
    const countdownEvent = {
      title: row.title.trim(),
      dateTime: new Date(row.dateTime).toISOString(),
      subtitle: row.subtitle?.trim() ? row.subtitle.trim() : undefined,
      venueName: row.venueName?.trim() ? row.venueName.trim() : undefined,
      addressText: row.addressText?.trim() ? row.addressText.trim() : undefined,
      city: row.city?.trim() ? row.city.trim() : undefined,
    };

    await saveMutation.mutateAsync({
      eventSlug,
      countdownEvent,
    });

    toast.success('Kaydedildi');

    onSuccess?.();
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-center text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-center text-sm">
        {description}
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormItem className="gap-3">
            <div className="mt-4 grid gap-6">
              <div className="border-input space-y-4 rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="countdownEvent.title"
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
                  name="countdownEvent.dateTime"
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
                  name="countdownEvent.subtitle"
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
                  name="countdownEvent.venueName"
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
                  name="countdownEvent.addressText"
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
                  name="countdownEvent.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir</FormLabel>
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
            </div>
          </FormItem>

          <div className="flex items-center justify-between gap-3">
            {onBack ? (
              <Button type="button" variant="secondary" onClick={onBack}>
                Geri
              </Button>
            ) : (
              <span />
            )}

            <Button
              type="submit"
              disabled={!form.formState.isDirty || saveMutation.isPending}
            >
              {submitLabel}
              {saveMutation.isPending && <LoadingSpinner />}
            </Button>
          </div>

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
