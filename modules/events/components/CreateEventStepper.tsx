'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { paths } from '@/lib/paths';
import { service_events } from '../client-queries';
import {
  createEventSchema,
  type CreateEventSchema,
} from '../schemas/create-event';
import { service_templates } from '@/modules/templates/client-queries';
import { InvitationIframePreview } from './InvitationIframePreview';

export function CreateEventStepper() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('');

  const templatesQuery = useQuery(service_templates.queries.list());

  const createMutation = useMutation(service_events.mutations.create());
  const publishMutation = useMutation(service_events.mutations.publish());

  const nowLocalIso = useMemo(() => {
    const d = new Date();
    // `datetime-local` expects `YYYY-MM-DDTHH:mm`
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}`;
  }, []);

  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      templateKey: '',
      primaryName: '',
      secondaryName: '',
      dateTimeIso: nowLocalIso,
      city: '',
      addressText: '',
      venueName: '',
    },
  });

  const goStep2 = (templateKey: string) => {
    form.setValue('templateKey', templateKey, { shouldValidate: true });
    setSelectedTemplateKey(templateKey);
    setStep(2);
  };

  const submitStep2 = form.handleSubmit(async (data) => {
    const res = await createMutation.mutateAsync(data);
    toast.success('Davet taslağı oluşturuldu');
    setCreatedSlug(res.slug);
    setStep(3);
  });

  const saveDraftAndExit = () => {
    if (!createdSlug) return;
    toast.success('Taslak kaydedildi');
    router.push(paths.dashboard.event.overview(createdSlug));
  };

  const publish = async () => {
    if (!createdSlug) return;
    await publishMutation.mutateAsync({ eventSlug: createdSlug });
    toast.success('Yayınlandı');
    router.push(paths.dashboard.event.overview(createdSlug));
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Yeni davet oluştur</h1>
          <p className="text-muted-foreground mt-1 text-sm">Adım {step}/3</p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Önce etkinlik türünü seçin. Sonrasında taslağı oluşturup panelden
            dilediğiniz gibi düzenleyebilirsiniz.
          </p>

          {templatesQuery.isLoading && (
            <div className="text-muted-foreground text-sm">Yükleniyor…</div>
          )}

          {templatesQuery.error && (
            <div className="text-destructive text-sm">
              {(templatesQuery.error as Error).message}
            </div>
          )}

          {templatesQuery.data && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {templatesQuery.data.templates.map((t) => {
                const active = selectedTemplateKey === t.key;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goStep2(t.key)}
                    className={[
                      'border-border/60 bg-card rounded-xl border p-4 text-left shadow-sm transition-colors',
                      'hover:border-border hover:bg-muted/40',
                      active ? 'ring-primary ring-2' : '',
                    ].join(' ')}
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {t.key}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <Form {...form}>
          <form className="grid gap-4" onSubmit={submitStep2}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-sm">
                  Zorunlu bilgileri girin. Diğer tüm detayları sonrasında
                  panelden düzenleyebilirsiniz.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
              >
                Geri
              </Button>
            </div>

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

            <Button type="submit" disabled={createMutation.isPending}>
              Önizlemeye geç
              {createMutation.isPending && <LoadingSpinner />}
            </Button>

            {createMutation.error && (
              <div className="text-destructive text-sm">
                {createMutation.error.message}
              </div>
            )}
          </form>
        </Form>
      )}

      {step === 3 && createdSlug && (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Taslağınız hazır. Yayınlayabilir veya taslak olarak kaydedip sonra
              devam edebilirsiniz.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(2)}
              >
                Geri
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={saveDraftAndExit}
              >
                Taslak kaydet ve çık
              </Button>

              <Button
                type="button"
                onClick={publish}
                disabled={publishMutation.isPending}
              >
                Yayınla
                {publishMutation.isPending && <LoadingSpinner />}
              </Button>
            </div>

            {publishMutation.error && (
              <div className="text-destructive text-sm">
                {publishMutation.error.message}
              </div>
            )}
          </div>

          <InvitationIframePreview slug={createdSlug} />
        </div>
      )}
    </div>
  );
}
