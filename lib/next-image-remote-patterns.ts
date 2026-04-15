import type { RemotePattern } from 'next/dist/shared/lib/image-config';

/**
 * `next/image` için Supabase Storage origin’leri.
 * Local dev (Supabase CLI) + prod (`NEXT_PUBLIC_SUPABASE_URL` host’u).
 */
export function getNextImageRemotePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [
    { protocol: 'http', hostname: '127.0.0.1', port: '54321', pathname: '/storage/v1/**' },
    { protocol: 'http', hostname: 'localhost', port: '54321', pathname: '/storage/v1/**' },
    { protocol: 'https', hostname: 'localhost', port: '54321', pathname: '/storage/v1/**' },
  ];

  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return patterns;

  try {
    const u = new URL(raw);
    patterns.push({
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      port: u.port || '',
      pathname: '/storage/v1/**',
    });
  } catch {
    /* ignore invalid URL */
  }

  return patterns;
}
