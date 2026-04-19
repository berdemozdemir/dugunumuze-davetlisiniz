'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { INVITATION_SECTION_OPTIONS } from '@/modules/templates/constants/invitation-section-options';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Checkbox } from '@/components/ui/Checkbox';
import { invitation_dashboard } from '../client-queries';
import {
  invitationVisibilityFormSchema,
  type InvitationVisibilityFormSchema,
} from '../schemas/invitation-visibility-form';

export type InvitationVisibilityEditorProps = {
  eventSlug: string;
  defaultValues: InvitationVisibilityFormSchema;
};

export function InvitationVisibilityEditor({
  eventSlug,
  defaultValues,
}: InvitationVisibilityEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateVisibility(),
  );

  const form = useForm<InvitationVisibilityFormSchema>({
    resolver: zodResolver(invitationVisibilityFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      eventSlug,
      sections: data.sections,
    });
    router.refresh();
    toast.success('Kaydedildi');
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Bölüm görünürlüğü</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Hangi blokların herkese açık davetiye sayfasında görüneceğini buradan
        yönetin. Metin ve görseller ilgili bölüm sekmelerinde düzenlenir.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
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
                        onCheckedChange={(next) => field.onChange(next === true)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <FormMessage />

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
