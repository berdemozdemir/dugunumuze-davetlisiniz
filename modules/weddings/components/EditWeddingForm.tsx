'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  updateWeddingSchema,
  type UpdateWeddingSchema,
} from '../schemas/update-wedding';
import { service_weddings } from '../client-queries';
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

export type EditWeddingFormProps = {
  weddingSlug: string;
  defaultValues: Omit<UpdateWeddingSchema, 'weddingSlug'> & {
    dateTime: string;
  };
};

export function EditWeddingForm({
  weddingSlug,
  defaultValues,
}: EditWeddingFormProps) {
  const updateMutation = useMutation(service_weddings.mutations.update());

  const form = useForm<UpdateWeddingSchema>({
    resolver: zodResolver(updateWeddingSchema),
    defaultValues: {
      weddingSlug,
      ...defaultValues,
    },
  });

  const submit = form.handleSubmit(async (data) => {
    await updateMutation.mutateAsync(data);
    toast.success('Saved');
  });

  return (
    <Form {...form}>
      <form className="mt-6 grid max-w-xl gap-4" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="partner1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner 1</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateMutation.isPending}>
          Save
          {updateMutation.isPending ? <LoadingSpinner /> : null}
        </Button>

        {updateMutation.error ? (
          <div className="text-destructive text-sm">
            {updateMutation.error.message}
          </div>
        ) : null}
      </form>
    </Form>
  );
}

