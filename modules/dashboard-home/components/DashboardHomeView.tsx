import { PageLayout } from '@/components/ui/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { paths } from '@/lib/paths';
import type { DashboardWeddingListItem } from '@/modules/dashboard-home/types';
import Link from 'next/link';
import { EmptyState } from './EmptyState';
import { EventCard } from './EventCard';

type DashboardHomeViewProps = {
  weddings: DashboardWeddingListItem[];
};

export function DashboardHomeView({ weddings }: DashboardHomeViewProps) {
  return (
    <PageLayout variant="wide" className="pt-8 pb-24">
      <div className="space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Panel&eacute;ye hoş geldiniz
            </h1>

            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              Davet sayfalarınızı buradan yönetin; dilerseniz yeni bir etkinlik
              için ayrı bir davet oluşturabilirsiniz.
            </p>
          </div>

          <Button asChild className="shrink-0 self-start sm:self-auto">
            <Link href={paths.dashboard.new}>Yeni etkinlik oluştur</Link>
          </Button>
        </div>

        {weddings.length === 0 && <EmptyState />}

        {weddings.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Etkinlikleriniz
            </h2>

            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {weddings.map((w) => (
                <li key={w.id}>
                  <EventCard wedding={w} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
