import { queryClient } from '@/integrations/tanstack-query/query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {children}
    </QueryClientProvider>
  );
};
