import { Button } from '@/components/ui/Button';
import { paths } from '@/lib/paths';
import { useRouter } from 'next/navigation';

export const AuthButtons = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => router.push(paths.auth.login)}>Giriş Yap</Button>

      <Button variant="ghost" onClick={() => router.push(paths.auth.signup)}>
        Kayıt Ol
      </Button>
    </div>
  );
};
