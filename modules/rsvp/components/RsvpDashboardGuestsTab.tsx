'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { formatInvitationDateTimeLabel } from '@/modules/invitation/util';
import { useSessionQuery } from '@/integrations/tanstack-query/query';
import { rsvp_dashboard } from '../client-queries';
import { companionLabel } from '../utils/companion-label';
import { Badge } from '@/components/ui/Badge';

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

  const hasRows =
    listQuery.data?.responses?.length && listQuery.data.responses.length > 0;

  if (listQuery.data)
    return (
      <div className="mt-6 space-y-4">
        {!hasRows && (
          <li className="text-muted-foreground rounded-lg border py-12 text-center text-sm">
            Henüz kayıt yok.
          </li>
        )}

        {listQuery.data?.responses?.map((r) => {
          const companions = r.companionsJson ?? [];
          const companionCount = Math.max(0, r.partySize - 1);
          const showCompanionFallback =
            companionCount > 0 && companions.length === 0;

          return (
            <div
              key={r.id}
              className="border-input rounded-lg border bg-transparent p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed pb-3">
                <p className="text-muted-foreground text-sm">
                  {formatInvitationDateTimeLabel(r.createdAt)}
                </p>

                <Badge>{r.partySize} kişi</Badge>
              </div>

              <div className="mt-3 space-y-4">
                <div>
                  <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
                    Başvuran
                  </p>

                  <p className="text-base font-medium">{r.primaryFullName}</p>

                  <p className="text-muted-foreground mt-0.5 text-sm tabular-nums">
                    {r.primaryPhone}
                  </p>
                </div>

                {(companions.length > 0 || showCompanionFallback) && (
                  <div>
                    <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
                      Beraberindekiler
                      {companionCount > 0 && (
                        <span className="text-muted-foreground/80 font-normal normal-case">
                          {' '}
                          ({companionCount})
                        </span>
                      )}
                    </p>

                    {companions.length > 0 && (
                      <ul className="space-y-1.5">
                        {companions.map((c, i) => (
                          <li
                            key={`${r.id}-c-${i}`}
                            className="border-gold/40 text-foreground/95 border-l-2 pl-3 text-sm leading-snug"
                          >
                            {companionLabel(c)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {companions.length === 0 && (
                      <p className="text-muted-foreground text-sm italic">
                        Yan misafir adı kayıtlı değil ({companionCount} kişi).
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
                    Not
                  </p>

                  {r.note?.trim() && (
                    <p className="bg-muted/40 text-foreground/95 rounded-md px-3 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {r.note}
                    </p>
                  )}

                  {r.note?.trim() === '' && (
                    <p className="text-muted-foreground text-sm italic">
                      Not yok.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

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
}
