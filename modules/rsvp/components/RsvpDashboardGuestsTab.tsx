'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { formatInvitationDateTimeLabel } from '@/modules/invitation/util';
import { useSessionQuery } from '@/integrations/tanstack-query/query';
import { rsvp_dashboard } from '../client-queries';

export type RsvpDashboardGuestRow = {
  id: string;
  primaryFullName: string;
  primaryPhone: string;
  partySize: number;
  note: string | null;
  createdAt: string;
};

export function RsvpDashboardGuestsTab({
  activeTab,
  eventSlug,
}: {
  eventSlug: string;
  activeTab: 'guests' | 'settings';
}) {
  // TODO: take a look at the queries, privates ones should be wrapped in a useSessionQuery
  const listQuery = useSessionQuery({
    ...rsvp_dashboard.queries.listResponses(eventSlug),
    enabled: activeTab === 'guests',
  });

  if (listQuery.isLoading) {
    return (
      <div className="mt-6 flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <p className="text-destructive mt-6 text-sm">
        Liste yüklenemedi. Sayfayı yenileyin.
      </p>
    );
  }

  const hasRows =
    listQuery.data?.responses?.length && listQuery.data.responses.length > 0;

  return (
    <div className="mt-6 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Ad</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Kişi</TableHead>
            <TableHead>Not</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasRows && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground py-10 text-center"
              >
                Henüz kayıt yok.
              </TableCell>
            </TableRow>
          )}

          {listQuery.data?.responses?.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap">
                {formatInvitationDateTimeLabel(r.createdAt)}
              </TableCell>
              <TableCell>{r.primaryFullName}</TableCell>
              <TableCell className="whitespace-nowrap">
                {r.primaryPhone}
              </TableCell>
              <TableCell>{r.partySize}</TableCell>
              <TableCell
                className="max-w-[220px] truncate"
                title={r.note ?? ''}
              >
                {r.note ?? '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
