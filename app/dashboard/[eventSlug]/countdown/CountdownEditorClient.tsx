'use client';

import { useRouter } from 'next/navigation';
import { InvitationCountdownEditor } from '@/modules/invitation/components/InvitationCountdownEditor';
import type { InvitationCountdownFormSchema } from '@/modules/invitation/schemas/invitation-countdown-form';
import { paths } from '@/lib/paths';

type Props = {
  eventSlug: string;
  defaultValues: InvitationCountdownFormSchema;
};

export function CountdownEditorClient({ eventSlug, defaultValues }: Props) {
  const router = useRouter();

  return (
    <InvitationCountdownEditor
      eventSlug={eventSlug}
      defaultValues={defaultValues}
      onSuccess={() => router.push(paths.dashboard.event.story(eventSlug))}
    />
  );
}

