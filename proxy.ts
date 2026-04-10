import { NextRequest } from 'next/server';
import { updateSession } from '@/integrations/supabase/middleware';

// TODO: add use auth middleware here, can cheat from udao
// TODO: add use i18n middleware here, can cheat from udao
// TODO: user should not go to landing page if they are logged in
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
