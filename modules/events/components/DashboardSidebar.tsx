'use client';

import { ThemeToggle } from '@/modules/header/components/ThemeToggle';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';
import {
  IconBook,
  IconMapPin,
  IconHeart,
  IconHome,
  IconLayoutDashboard,
  IconMusic,
  IconPhoto,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { paths } from '@/lib/paths';
import { UserMenu } from '@/modules/header/components/UserMenu';

export const DashboardSidebar = ({ eventSlug }: { eventSlug: string }) => {
  return (
    <aside className="border-border/60 bg-background flex w-full shrink-0 flex-col justify-between border-r p-4 md:w-[260px] md:min-h-0 md:overflow-hidden">
      <nav className="my-4 grid gap-1 text-sm">
        <SideBarItem
          href={paths.dashboard.base}
          label="Ana sayfa"
          Icon={IconHome}
        />

        <SideBarItem
          href={paths.dashboard.event.overview(eventSlug)}
          label="Genel Bakış"
          Icon={IconLayoutDashboard}
        />

        <SideBarItem
          href={paths.dashboard.event.cover(eventSlug)}
          label="Kapak"
          Icon={IconPhoto}
        />

        <SideBarItem
          href={paths.dashboard.event.countdown(eventSlug)}
          label="Etkinlik detayları"
          Icon={IconMapPin}
        />

        <SideBarItem
          href={paths.dashboard.event.story(eventSlug)}
          label="Hikâye metni"
          Icon={IconBook}
        />

        <SideBarItem
          href={paths.dashboard.event.closing(eventSlug)}
          label="Kapanış"
          Icon={IconHeart}
        />

        <SideBarItem
          href={paths.dashboard.event.media(eventSlug)}
          label="Medya"
          Icon={IconMusic}
        />

        <SideBarItem
          href={paths.dashboard.event.rsvp(eventSlug)}
          label="Rezervasyon"
          Icon={IconUsers}
        />

        <SideBarItem
          href={paths.dashboard.event.settings(eventSlug)}
          label="Ayarlar"
          Icon={IconSettings}
        />
      </nav>

      <div className="flex flex-col items-start gap-2">
        <ThemeToggle />

        <UserMenu />
      </div>
    </aside>
  );
};

const SideBarItem = ({
  href,
  label,
  Icon,
}: {
  href?: string;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
}) => {
  const pathname = usePathname();

  const isActive = href !== undefined && pathname === href;

  if (!href) {
    return (
      <h1 className="text-muted-foreground mb-2 text-lg font-medium">
        {label}
      </h1>
    );
  }

  return (
    <Link
      className={cn(
        'hover:bg-muted flex items-center gap-2 rounded-md p-2',
        isActive && 'bg-muted',
      )}
      href={href}
    >
      {Icon ? <Icon className="size-5 shrink-0" aria-hidden /> : null}

      {label}
    </Link>
  );
};
