'use client';

import { paths } from '@/lib/paths';
import Image from 'next/image';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { useAuthQuery } from '@/modules/auth/client-queries';
import { AuthButtons } from './AuthButtons';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Header() {
  const authQuery = useAuthQuery();

  const isAuthQueryLoading = authQuery.isLoading;
  const showAuthButtons = !authQuery.data?.isLoggedIn && !isAuthQueryLoading;
  const showUserMenu = authQuery.data?.isLoggedIn && !isAuthQueryLoading;

  return (
    <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container flex items-center justify-between">
        <Link href={paths.home}>
          <Image
            src="/images/wedding-rings.png"
            alt="Site logosu"
            width={100}
            height={100}
            className="h-10 w-10"
          />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthQueryLoading && (
            <>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </>
          )}

          {showUserMenu && <UserMenu />}

          {showAuthButtons && <AuthButtons />}
        </div>
      </div>
    </header>
  );
}
