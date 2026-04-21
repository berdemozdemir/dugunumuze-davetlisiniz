'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatInvitationDateTimeLabel } from '@/modules/invitation/util';
import { RSVP_MAX_COMPANIONS } from '@/modules/rsvp/constants';
import { rsvp_public } from '@/modules/rsvp/client-queries';
import { rsvpSubmitFormSchema } from '@/modules/rsvp/schemas/rsvp-submit-form';
import type { RsvpSubmitFormValues } from '@/modules/rsvp/schemas/rsvp-submit-form';
import type { RsvpPublicState } from '@/modules/rsvp/types';
import { rsvpGuestClosedMessage } from '@/modules/rsvp/utils/closed-message';

export type PublicRsvpSectionProps = {
  slug: string;
  initialState: RsvpPublicState;
};

export function PublicRsvpSection({
  slug,
  initialState,
}: PublicRsvpSectionProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<RsvpSubmitFormValues>({
    resolver: zodResolver(rsvpSubmitFormSchema),
    defaultValues: {
      primaryFullName: '',
      primaryPhone: '',
      companions: [],
      note: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'companions',
  });

  const submitMutation = useMutation(rsvp_public.mutations.submit());

  const canOpen = initialState.canSubmit;

  const footerNote = useMemo(() => {
    return `Bu kayıt, programınızdaki en geç etkinlik için geçerlidir: ${initialState.finalEventTitle} (${formatInvitationDateTimeLabel(initialState.finalEventIso)}).`;
  }, [initialState.finalEventIso, initialState.finalEventTitle]);

  const deadlineHint = useMemo(() => {
    if (!initialState.deadlineIso) return null;
    return `Son başvuru: ${formatInvitationDateTimeLabel(initialState.deadlineIso)}`;
  }, [initialState.deadlineIso]);

  const onDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
    }
  };

  const addCompanion = () => {
    if (fields.length >= RSVP_MAX_COMPANIONS) {
      toast.error('Yanınızda en fazla 20 kişi getirebiliyorsunuz');
      return;
    }
    append({ fullName: '', phone: null });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!canOpen) return;

    await submitMutation.mutateAsync({
      slug,
      primaryFullName: data.primaryFullName.trim(),
      primaryPhone: data.primaryPhone.trim(),
      companions: data.companions.map((c) => ({
        fullName: c.fullName.trim(),
        phone: c.phone?.trim() ? c.phone.trim() : undefined,
      })),
      note: data.note?.trim() || undefined,
    });

    toast.success('Kaydınız alındı');

    form.reset();

    setOpen(false);
  });

  const blocked = rsvpGuestClosedMessage(initialState.closedReason);

  return (
    <section className="bg-deep/40 border-y border-white/5 py-16">
      <div className="mx-auto max-w-lg px-6 text-center">
        <h2 className="text-gold font-serif text-2xl tracking-wide md:text-3xl">
          Rezervasyon
        </h2>

        {deadlineHint && (
          <p className="text-cream/70 mt-3 text-sm">{deadlineHint}</p>
        )}

        {initialState.maxTotalGuests !== null && (
          <p className="text-cream/50 mt-1 text-xs">
            Onaylı toplam kişi: {initialState.reservedTotal} /{' '}
            {initialState.maxTotalGuests}
          </p>
        )}

        {!canOpen && blocked && (
          <p className="text-cream/60 mt-6 text-sm">{blocked}</p>
        )}

        <div className="mt-8">
          <Button
            type="button"
            size="lg"
            className="rounded-full px-8"
            disabled={!canOpen}
            onClick={() => canOpen && setOpen(true)}
          >
            {initialState.buttonLabel}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={onDialogOpenChange}>
        <DialogContent className="border-cream/10 bg-deep text-cream max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {initialState.buttonLabel}
            </DialogTitle>

            <DialogDescription className="text-cream/70 text-left text-xs">
              {footerNote}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="grid gap-4 pt-2" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="primaryFullName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Ad soyad</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        className="border-cream/20 bg-deep/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryPhone"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Cep telefonu</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="05xx veya +90"
                        className="border-cream/20 bg-deep/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border-cream/10 space-y-2 rounded-lg border p-3 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-cream/80 text-sm font-medium">
                      Misafir {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-cream/60 h-8"
                      onClick={() => remove(index)}
                    >
                      Kaldır
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`companions.${index}.fullName`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Ad soyad</FormLabel>
                        <FormControl>
                          <Input
                            className="border-cream/20 bg-deep/60"
                            {...f}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`companions.${index}.phone`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>
                          Telefon{' '}
                          <span className="text-cream/50 font-normal">
                            (isteğe bağlı)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="tel"
                            className="border-cream/20 bg-deep/60"
                            value={f.value ?? ''}
                            onChange={f.onChange}
                            onBlur={f.onBlur}
                            name={f.name}
                            ref={f.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {fields.length < RSVP_MAX_COMPANIONS && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-cream/20 text-cream"
                  onClick={addCompanion}
                >
                  Bir kişi ile daha geliyorum
                </Button>
              )}

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Not (isteğe bağlı)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className="border-cream/20 bg-deep/60 resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="mt-2 w-full rounded-full"
              >
                Gönder
                {submitMutation.isPending && <LoadingSpinner />}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
