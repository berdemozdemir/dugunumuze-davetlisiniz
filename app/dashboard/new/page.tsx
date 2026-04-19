import { AuthenticatedPage } from '@/components/ui/layout/Authenticated';
import { CreateEventForm } from '@/modules/events/components/CreateEventForm';

export default function DashboardNewEventPage() {
  return (
    <AuthenticatedPage variant="wide">
      <CreateEventForm />
    </AuthenticatedPage>
  );
}
