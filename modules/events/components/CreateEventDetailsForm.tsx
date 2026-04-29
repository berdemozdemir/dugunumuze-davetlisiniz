'use client';

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
import type { CreateEventSchema } from '../schemas/create-event';
import type { UseFormReturn } from 'react-hook-form';
import { ArrowLeftIcon } from 'lucide-react';

type Props = {
  form: UseFormReturn<CreateEventSchema>;
  onSubmit: React.ComponentPropsWithoutRef<'form'>['onSubmit'];
  onBack: () => void;
  isSubmitting: boolean;
  submitErrorMessage?: string;
};

export function CreateEventDetailsForm({
  form,
  onSubmit,
  onBack,
  isSubmitting,
  submitErrorMessage,
}: Props) {
  return (
    <Form {...form}>
      <form
        className="mx-auto grid w-full max-w-xl gap-4 text-center"
        onSubmit={onSubmit}
      >
        <p className="text-muted-foreground mb-4">
          Zorunlu bilgileri girin. Diğer tüm detayları sonrasında panelden
          düzenleyebilirsiniz.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birinci isim</FormLabel>
                <FormControl>
                  <Input placeholder="Elif" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İkinci isim (opsiyonel)</FormLabel>
                <FormControl>
                  <Input placeholder="Erdem" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dateTimeIso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarih / saat</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şehir</FormLabel>
                <FormControl>
                  <Input placeholder="İstanbul" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mekân adı (opsiyonel)</FormLabel>
              <FormControl>
                <Input placeholder="Bahçe / Salon / Ev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Input placeholder="Açık adres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-3">
          <Button variant="secondary" onClick={onBack} className="w-fit">
            <ArrowLeftIcon className="size-4" />
            Geri
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
          >
            Önizlemeye geç
            {isSubmitting && <LoadingSpinner />}
          </Button>
        </div>

        {submitErrorMessage && (
          <div className="text-destructive text-sm">{submitErrorMessage}</div>
        )}
      </form>
    </Form>
  );
}
