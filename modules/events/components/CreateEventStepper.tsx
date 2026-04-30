'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Stepper,
  StepperContentPersistent,
  StepperList,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/Stepper';
import { paths } from '@/lib/paths';
import { service_events } from '../client-queries';
import {
  createEventSchema,
  type CreateEventSchema,
} from '../schemas/create-event';
import { service_templates } from '@/modules/templates/client-queries';
import { CreateEventDetailsForm } from './CreateEventDetailsForm';
import { InvitationIframePreview } from './InvitationIframePreview';
import type { InvitationDefaults } from '@/modules/templates/types';
import { InvitationCountdownEditor } from '@/modules/invitation/components/InvitationCountdownEditor';
import { toDateTimeLocal } from '@/modules/events/util';

type CreateEventStepValue = 'template' | 'details' | 'countdown' | 'preview';

export function CreateEventStepper() {
  const router = useRouter();

  const [stepValue, setStepValue] = useState<CreateEventStepValue>('template');
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('');
  const [countdownSaved, setCountdownSaved] = useState<boolean>(false);
  const [previewVersion, setPreviewVersion] = useState<number>(0);

  const templatesQuery = useQuery(service_templates.queries.list());

  const createMutation = useMutation(service_events.mutations.create());
  const publishMutation = useMutation(service_events.mutations.publish());

  const isDetailsEnabled = Boolean(selectedTemplateKey);
  const isCountdownEnabled = Boolean(createdSlug);
  const isPreviewEnabled = Boolean(createdSlug) && countdownSaved;

  const selectedTemplateDefaults = useMemo(() => {
    const t = templatesQuery.data?.templates.find(
      (x) => x.key === selectedTemplateKey,
    );
    return (t?.defaultsJson as InvitationDefaults | undefined) ?? null;
  }, [selectedTemplateKey, templatesQuery.data?.templates]);

  const selectedTemplateName = useMemo(() => {
    const t = templatesQuery.data?.templates.find(
      (x) => x.key === selectedTemplateKey,
    );
    return t?.name ?? undefined;
  }, [selectedTemplateKey, templatesQuery.data?.templates]);

  const stepIndex =
    stepValue === 'template'
      ? 0
      : stepValue === 'details'
        ? 1
        : stepValue === 'countdown'
          ? 2
          : 3;
  const stepNumber = stepIndex + 1;

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

  const createCountdownDefaultValues = useMemo(() => {
    const title = selectedTemplateName?.trim()
      ? `${selectedTemplateName.trim()} etkinliği`
      : 'Etkinlik';

    const dt = new Date(form.getValues('dateTimeIso'));
    const dtLocal = Number.isNaN(dt.getTime())
      ? toDateTimeLocal(new Date())
      : toDateTimeLocal(dt);

    return {
      countdownEvent: {
        title,
        dateTime: dtLocal,
        subtitle: '',
        venueName: form.getValues('venueName') ?? '',
        addressText: form.getValues('addressText') ?? '',
        city: form.getValues('city') ?? '',
      },
    };
  }, [form, selectedTemplateName]);

  const goDetails = (templateKey: string) => {
    form.setValue('templateKey', templateKey, { shouldValidate: true });
    setSelectedTemplateKey(templateKey);
    setCountdownSaved(false);
    setPreviewVersion((x) => x + 1);
    setStepValue('details');
  };

  const submitStep2 = form.handleSubmit(async (data) => {
    const res = await createMutation.mutateAsync(data);
    toast.success('Davet taslağı oluşturuldu');
    setCreatedSlug(res.slug);
    setCountdownSaved(false);
    setPreviewVersion((x) => x + 1);
    setStepValue('countdown');
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
      <Stepper
        value={stepValue}
        onValueChange={(v) => {
          const next = v as CreateEventStepValue;
          if (next === 'details' && !isDetailsEnabled) return;
          if (next === 'countdown' && !isCountdownEnabled) return;
          if (next === 'preview' && !isPreviewEnabled) return;
          setStepValue(next);
        }}
      >
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">Yeni davet oluştur</h1>

          <StepperList>
            <StepperTrigger value="template" isCompleted={stepIndex > 0}>
              1
            </StepperTrigger>

            <StepperSeparator />

            <StepperTrigger
              value="details"
              disabled={!isDetailsEnabled}
              isCompleted={stepIndex > 1}
            >
              2
            </StepperTrigger>

            <StepperSeparator />

            <StepperTrigger
              value="countdown"
              disabled={!isCountdownEnabled}
              isCompleted={stepIndex > 2}
            >
              3
            </StepperTrigger>

            <StepperSeparator />

            <StepperTrigger value="preview" disabled={!isPreviewEnabled}>
              4
            </StepperTrigger>
          </StepperList>
        </div>

        <StepperContentPersistent value="template" currentValue={stepValue}>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Önce etkinlik türünü seçin. Sonrasında taslağı oluşturup panelden
              dilediğiniz gibi düzenleyebilirsiniz.
            </p>

            {templatesQuery.isLoading && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                Yükleniyor… <LoadingSpinner />
              </div>
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
                    <div
                      key={t.id}
                      onClick={() => goDetails(t.key)}
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </StepperContentPersistent>

        <StepperContentPersistent value="details" currentValue={stepValue}>
          <CreateEventDetailsForm
            form={form}
            templateDefaults={selectedTemplateDefaults}
            onSubmit={submitStep2}
            onBack={() => setStepValue('template')}
            isSubmitting={createMutation.isPending}
            submitErrorMessage={createMutation.error?.message}
          />
        </StepperContentPersistent>

        <StepperContentPersistent
          value="countdown"
          currentValue={stepValue}
          className="flex items-center justify-center text-center"
        >
          {createdSlug && (
            <InvitationCountdownEditor
              eventSlug={createdSlug}
              defaultValues={createCountdownDefaultValues}
              title="Etkinlik bilgileri"
              description="Davetiyedeki geri sayım ve etkinlik detayları için tarih ve konum girin. İsterseniz sonrasında panelden düzenleyebilirsiniz."
              submitLabel="Önizlemeye geç"
              onBack={() => setStepValue('details')}
              onSuccess={() => {
                setCountdownSaved(true);
                setPreviewVersion((x) => x + 1);
                setStepValue('preview');
              }}
            />
          )}

          {!createdSlug && (
            <div className="text-muted-foreground text-sm">
              Önizleme için önce taslak oluşturmalısınız.
            </div>
          )}
        </StepperContentPersistent>

        <StepperContentPersistent value="preview" currentValue={stepValue}>
          {createdSlug && (
            <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Taslağınız hazır. Yayınlayabilir veya taslak olarak kaydedip
                  sonra devam edebilirsiniz.
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStepValue('countdown')}
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

              <InvitationIframePreview
                slug={createdSlug}
                version={previewVersion}
              />
            </div>
          )}

          {!createdSlug && (
            <div className="text-muted-foreground text-sm">
              Önizleme için önce taslak oluşturmalısınız.
            </div>
          )}
        </StepperContentPersistent>
      </Stepper>
    </div>
  );
}
