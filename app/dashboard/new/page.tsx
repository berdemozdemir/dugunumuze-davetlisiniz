import { AuthenticatedPage } from '@/components/ui/layout/Authenticated';
import { CreateEventStepper } from '@/modules/events/components/CreateEventStepper';

export default function DashboardNewEventPage() {
  return (
    <AuthenticatedPage variant="wide">
      <CreateEventStepper />
    </AuthenticatedPage>
  );
}
