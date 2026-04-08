import { paths } from '@/lib/paths';
import Image from 'next/image';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between">
        <Link href={paths.home}>
          <Image
            src="/images/wedding-rings.png"
            alt="Logo"
            width={100}
            height={100}
            className="h-10 w-10"
          />
        </Link>

        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
