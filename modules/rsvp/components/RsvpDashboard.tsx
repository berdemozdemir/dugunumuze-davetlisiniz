'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { RsvpDashboardGuestsTab } from '@/modules/rsvp/components/RsvpDashboardGuestsTab';
import { RsvpDashboardSettingsTab } from '@/modules/rsvp/components/RsvpDashboardSettingsTab';
import {} from '@/modules/rsvp/schemas/rsvp-dashboard-settings-form';
import type { RsvpOwnerSummary } from '@/modules/rsvp/types';
import { paths } from '@/lib/paths';
import { AuthenticatedPage } from '@/components/ui/layout/Authenticated';

export function RsvpDashboard({
  eventSlug,
  summary,
}: {
  eventSlug: string;
  summary: RsvpOwnerSummary;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'guests' ? 'guests' : 'settings';

  const navigateToTab = (next: string) => {
    const q = new URLSearchParams(searchParams.toString());
    q.set('tab', next);
    const qs = q.toString();
    router.push(
      `${paths.dashboard.event.rsvp(eventSlug)}${qs ? `?${qs}` : ''}`,
    );
  };

  return (
    <AuthenticatedPage>
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">RSVP</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Son başvuru tarihi ve kontenjanı yönetin; gelen kayıtları ikinci
          sekmede görün.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={navigateToTab}>
        <TabsList>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>

          <TabsTrigger value="guests">Kayıtlar</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <RsvpDashboardSettingsTab eventSlug={eventSlug} summary={summary} />
        </TabsContent>

        <TabsContent value="guests">
          <RsvpDashboardGuestsTab eventSlug={eventSlug} activeTab={activeTab} />
        </TabsContent>
      </Tabs>
    </AuthenticatedPage>
  );
}
