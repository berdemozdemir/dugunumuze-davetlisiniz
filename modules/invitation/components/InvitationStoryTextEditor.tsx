'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
} from '@/modules/invitation/constants';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { invitation_dashboard } from '../client-queries';
import {
  invitationStoryTextFormSchema,
  type InvitationStoryTextFormSchema,
} from '../schemas/invitation-story-text-form';

export type InvitationStoryTextEditorProps = {
  eventSlug: string;
  defaultValues: InvitationStoryTextFormSchema;
};

export function InvitationStoryTextEditor({
  eventSlug,
  defaultValues,
}: InvitationStoryTextEditorProps) {
  const router = useRouter();

  const saveMutation = useMutation(
    invitation_dashboard.mutations.updateStoryText(),
  );

  const form = useForm<InvitationStoryTextFormSchema>({
    resolver: zodResolver(invitationStoryTextFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const submit = form.handleSubmit(async (data) => {
    await saveMutation.mutateAsync({
      eventSlug,
      storyHeadline: data.storyHeadline,
      storySubline: data.storySubline,
    });
    router.refresh();
    toast.success('Kaydedildi');
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold">Hikâye metni</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Hikâye bölümündeki başlık ve alt metin. İsimler Kapak sayfasından;
        tarih ve mekânlar Etkinlik detayları sayfasından gelir.
      </p>

      <Form {...form}>
        <form className="mt-6 grid gap-6" onSubmit={submit}>
          <FormField
            control={form.control}
            name="storyHeadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hikâye başlığı</FormLabel>
                <FormDescription>
                  Boş bırakırsanız varsayılan metin gösterilir.
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder={STORY_HEADLINE_DEFAULT}
                    {...field}
                  />
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
                  Başlığın altındaki ince satır. Boş bırakırsanız varsayılan
                  gösterilir.
                </FormDescription>
                <FormControl>
                  <Textarea placeholder={STORY_SUBLINE_DEFAULT} {...field} />
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
    </div>
  );
}
