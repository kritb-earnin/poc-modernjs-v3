import type { LoaderFunctionArgs } from '@modern-js/runtime/router';

export type SsrProbeData = {
  nowIso: string;
  userAgent: string | null;
  url: string;
};

export const loader = async ({ request }: LoaderFunctionArgs): Promise<SsrProbeData> => {
  return {
    nowIso: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    url: request.url,
  };
};

