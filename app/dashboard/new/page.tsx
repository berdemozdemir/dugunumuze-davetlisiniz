import { AuthenticatedPage } from '@/components/ui/layout/Authenticated';
import { CreateWeddingForm } from '@/modules/weddings/components/CreateWeddingForm';

export default function DashboardNewWeddingPage() {
  return (
    <AuthenticatedPage variant="wide">
      <CreateWeddingForm />
    </AuthenticatedPage>
  );
}
