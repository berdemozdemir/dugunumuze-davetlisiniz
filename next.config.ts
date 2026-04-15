import type { NextConfig } from 'next';

import { getNextImageRemotePatterns } from './lib/next-image-remote-patterns';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getNextImageRemotePatterns(),
  },
};

export default nextConfig;
