import { useLoaderData } from '@modern-js/runtime/router';
import type { SsrProbeData } from './page.data';

export default function SsrProbePage() {
  const data = useLoaderData() as SsrProbeData;

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ margin: 0 }}>SSR probe</h1>
      <p style={{ marginTop: 8, color: '#444' }}>
        If SSR is working on Netlify Functions, this page should show a server-generated timestamp
        on initial load (and change on refresh).
      </p>

      <dl style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <div>
          <dt style={{ fontWeight: 600 }}>nowIso</dt>
          <dd style={{ margin: 0 }}>{data.nowIso}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>url</dt>
          <dd style={{ margin: 0 }}>{data.url}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>userAgent</dt>
          <dd style={{ margin: 0, wordBreak: 'break-word' }}>{data.userAgent ?? '(null)'}</dd>
        </div>
      </dl>
    </main>
  );
}

