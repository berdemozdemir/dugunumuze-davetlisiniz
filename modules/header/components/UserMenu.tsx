'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { paths } from '@/lib/paths';
import { getTwoLetterInitials } from '@/lib/utils';
import { service_auth, useAuthQuery } from '@/modules/auth/client-queries';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const UserMenu = () => {
  const router = useRouter();

  const authQuery = useAuthQuery();
  const logoutMutation = useMutation(service_auth.mutations.logout({ router }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={authQuery.data?.user?.metadata?.avatar_url} />
          <AvatarFallback>
            {getTwoLetterInitials(authQuery.data?.user?.fullName ?? '')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">
            {authQuery.data?.user?.fullName}
          </p>

          <p className="text-xs opacity-60">{authQuery.data?.user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(paths.dashboard.base)}>
          Panel
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
