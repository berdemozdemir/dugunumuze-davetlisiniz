'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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

type Props = {
  weddingSlug: string;
  merged: InvitationDefaults;
};

export function InvitationOverridesForm({ weddingSlug, merged }: Props) {
  const saveMutation = useMutation(
    service_templates.mutations.updateWeddingInvitationOverrides(),
  );

  const form = useForm<InvitationOverridesFormSchema>({
    resolver: zodResolver(invitationOverridesSchema),
    defaultValues: {
      quote: merged.quote ?? '',
      shortNote: merged.shortNote ?? '',
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

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      weddingSlug,
      overrides: data,
    });

    toast.success('Saved');
  });

  return (
    <div className="mt-10 max-w-xl">
      <h2 className="text-xl font-semibold">Template overrides</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Customize what appears on your public invitation page.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alıntı / söz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Kısa not" {...field} />
                </FormControl>
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
            {saveMutation.isPending ? <LoadingSpinner /> : null}
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
