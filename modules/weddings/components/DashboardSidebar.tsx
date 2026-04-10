'use client';

import { ThemeToggle } from '@/modules/header/components/ThemeToggle';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';
import {
  IconLayoutDashboard,
  IconMailSpark,
  IconMusic,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { paths } from '@/lib/paths';

export const DashboardSidebar = ({ weddingSlug }: { weddingSlug: string }) => {
  return (
    <aside className="border-border/60 bg-background border-r p-4">
      <nav className="my-4 grid gap-1 text-sm">
        <SideBarItem label="Dashboard" />

        <SideBarItem
          href={paths.dashboard.wedding.overview(weddingSlug)}
          label="Overview"
          Icon={IconLayoutDashboard}
        />

        <SideBarItem
          href={paths.dashboard.wedding.invitation(weddingSlug)}
          label="Invitation"
          Icon={IconMailSpark}
        />

        <SideBarItem
          href={paths.dashboard.wedding.rsvp(weddingSlug)}
          label="RSVP"
          Icon={IconUsers}
        />

        <SideBarItem
          href={paths.dashboard.wedding.media(weddingSlug)}
          label="Media"
          Icon={IconMusic}
        />

        <SideBarItem
          href={paths.dashboard.wedding.settings(weddingSlug)}
          label="Settings"
          Icon={IconSettings}
        />
      </nav>

      <ThemeToggle />
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

  const isActive = pathname === href;

  if (!href) {
    return (
      // TODO: take typography from udao
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
