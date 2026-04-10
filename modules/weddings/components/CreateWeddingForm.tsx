'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  createWeddingSchema,
  type CreateWeddingSchema,
} from '../schemas/create-wedding';
import { service_weddings } from '../client-queries';
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

export function CreateWeddingForm() {
  const router = useRouter();

  const createMutation = useMutation(service_weddings.mutations.create());

  const form = useForm<CreateWeddingSchema>({
    resolver: zodResolver(createWeddingSchema),
    defaultValues: {
      partner1Name: '',
      partner2Name: '',
      dateTime: '',
      city: '',
      venueName: '',
      addressText: '',
    },
  });

  const submit = form.handleSubmit(async (data: CreateWeddingSchema) => {
    const res = await createMutation.mutateAsync(data);

    toast.success('Wedding created');

    router.push(paths.dashboard.wedding.overview(res.slug));
  });

  return (
    <Form {...form}>
      <form
        className="mx-auto mt-8 grid w-full max-w-xl gap-4"
        onSubmit={submit}
      >
        <h1 className="text-2xl font-semibold">Create your wedding</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Fill the basics to generate your invitation link.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="partner1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 1</FormLabel>

                <FormControl>
                  <Input placeholder="Elif" {...field} />
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
                  <Input placeholder="Erdem" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TODO: add date picker */}
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: add location picker from google maps */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="İstanbul" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Salon adı" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="addressText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Tam adres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full"
        >
          Create wedding
          {createMutation.isPending && <LoadingSpinner />}
        </Button>

        {createMutation.error ? (
          <div className="text-destructive text-sm">
            {createMutation.error.message}
          </div>
        ) : null}
      </form>
    </Form>
  );
}
