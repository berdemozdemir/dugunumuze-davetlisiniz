'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  createEventSchema,
  type CreateEventInput,
} from '../schemas/create-event';
import { service_events } from '../client-queries';
import { paths } from '@/lib/paths';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function CreateEventForm() {
  const router = useRouter();

  const createMutation = useMutation(service_events.mutations.create());

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      partner1Name: '',
      partner2Name: '',
    },
  });

  const submit = form.handleSubmit(async (data: CreateEventInput) => {
    const res = await createMutation.mutateAsync(data);

    toast.success('Davet oluşturuldu');

    router.push(paths.dashboard.event.overview(res.slug));
  });

  return (
    <Form {...form}>
      <form
        className="mx-auto mt-8 grid w-full max-w-xl gap-4"
        onSubmit={submit}
      >
        <h1 className="text-2xl font-semibold">Yeni davet oluştur</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Nişan, düğün veya başka bir kutlama için çift isimlerini girin. Tarih
          ve mekânları <strong>Etkinlik detayları</strong> sayfasından
          ekleyebilirsiniz.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="partner1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 1</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Elif"
                    {...field}
                    autoComplete="given-name"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partner2Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Erdem"
                    {...field}
                    autoComplete="given-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full"
        >
          Devam et
          {createMutation.isPending && <LoadingSpinner />}
        </Button>

        {createMutation.error && (
          <div className="text-destructive text-sm">
            {createMutation.error.message}
          </div>
        )}
      </form>
    </Form>
  );
}
