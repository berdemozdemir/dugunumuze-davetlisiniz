'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatInvitationDateTimeLabel } from '@/modules/invitation/util';
import {
  rsvpDashboardSettingsFormSchema,
  type RsvpDashboardSettingsFormSchema,
} from '@/modules/rsvp/schemas/rsvp-dashboard-settings-form';
import type { RsvpOwnerSummary } from '@/modules/rsvp/types';
import {
  datetimeLocalValueToIso,
  isoToDatetimeLocalValue,
} from '@/modules/rsvp/utils/datetime-local';
import { paths } from '@/lib/paths';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { rsvp_dashboard } from '@/modules/rsvp/client-queries';
import { useRouter } from 'next/navigation';

export function RsvpDashboardSettingsTab({
  eventSlug,
  summary,
}: {
  eventSlug: string;
  summary: RsvpOwnerSummary;
}) {
  const router = useRouter();

  const saveMutation = useMutation(rsvp_dashboard.mutations.updateSettings());

  const rawDeadlineIso = summary.rsvpDeadlineIso?.trim() ?? '';
  const defaultDeadlineLocal =
    rawDeadlineIso !== ''
      ? isoToDatetimeLocalValue(rawDeadlineIso)
      : isoToDatetimeLocalValue(summary.deadlineMaxIso);

  const maxGuestsValue =
    summary.rsvpMaxTotalGuests !== null && summary.rsvpMaxTotalGuests !== undefined
      ? String(summary.rsvpMaxTotalGuests)
      : '';

  const form = useForm<RsvpDashboardSettingsFormSchema>({
    resolver: zodResolver(rsvpDashboardSettingsFormSchema),
    defaultValues: {
      deadlineLocal: defaultDeadlineLocal,
      maxGuests: maxGuestsValue,
      buttonLabel: summary.rsvpButtonLabel ?? '',
    },
  });

  const onSave = form.handleSubmit(async (data) => {
    const result = datetimeLocalValueToIso(data.deadlineLocal);
    if (result[0]) {
      toast.error(result[0].message);
      return;
    }

    const rsvpDeadlineIso = result[1]!;

    const maxRaw = data.maxGuests.trim();
    const rsvpMaxTotalGuests =
      maxRaw === '' ? null : Number.parseInt(maxRaw, 10);
    if (
      maxRaw !== '' &&
      (!Number.isFinite(rsvpMaxTotalGuests) || rsvpMaxTotalGuests! < 1)
    ) {
      toast.error('Kontenjan sayısı geçersiz');
      return;
    }

    await saveMutation.mutateAsync({
      eventSlug,
      rsvpDeadlineIso,
      rsvpMaxTotalGuests,
      rsvpButtonLabel: data.buttonLabel?.trim() || undefined,
    });

    toast.success('Kaydedildi');

    router.refresh();
  });

  return (
    <div className="mt-6 space-y-6">
      <div className="text-muted-foreground rounded-lg border p-4 text-sm">
        <p>
          En geç program öğesi:{' '}
          <span className="text-foreground font-medium">
            {summary.finalEventTitle}
          </span>{' '}
          ({formatInvitationDateTimeLabel(summary.finalEventIso)}).
        </p>

        <p className="mt-2">
          Son başvuru en geç{' '}
          {formatInvitationDateTimeLabel(summary.deadlineMaxIso)} tarihinden
          önce olmalıdır (etkinlikten en az 2 saat önce).
        </p>

        <p className="mt-2">
          Şu an onaylı toplam kişi:{' '}
          <span className="text-foreground font-medium">
            {summary.reservedTotal}
          </span>
        </p>
      </div>

      <Form {...form}>
        <form className="grid max-w-md gap-4" onSubmit={onSave}>
          <FormField
            control={form.control}
            name="deadlineLocal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Son başvuru (yerel saat)</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    max={isoToDatetimeLocalValue(summary.deadlineMaxIso)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maksimum toplam kişi (opsiyonel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Boş = sınır yok"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buton metni</FormLabel>
                <FormControl>
                  <Input placeholder="Rezervasyon yap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={saveMutation.isPending || !form.formState.isDirty}
          >
            Kaydet
            {saveMutation.isPending && <LoadingSpinner />}
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-sm">
        Bölümün davetiyede görünmesi için{' '}
        <Link
          className="text-primary underline-offset-4 hover:underline"
          href={paths.dashboard.event.settings(eventSlug)}
        >
          Ayarlar
        </Link>{' '}
        sayfasında rezervasyon bölümü açık olmalıdır.
      </p>
    </div>
  );
}
