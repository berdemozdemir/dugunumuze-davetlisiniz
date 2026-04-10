'use client';

import { paths } from '@/lib/paths';
import { useAuthQuery } from '@/modules/auth/client-queries';
import { useRouter } from 'next/navigation';
import { useEffect, type PropsWithChildren } from 'react';
import { PageLayout, type PageLayoutProps } from './PageLayout';

export function Authenticated({ children }: PropsWithChildren) {
  const router = useRouter();

  const { data, isLoading } = useAuthQuery();

  useEffect(() => {
    if (isLoading) return;

    if (!data?.isLoggedIn) {
      router.push(paths.auth.login);
    }
  }, [data?.isLoggedIn, isLoading, router]);

  if (isLoading || !data?.isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

export function AuthenticatedPage(props: PageLayoutProps) {
  return (
    <Authenticated>
      <PageLayout {...props} />
    </Authenticated>
  );
}
