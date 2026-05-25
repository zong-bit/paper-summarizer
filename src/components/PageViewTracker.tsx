/**
 * PageViewTracker — 客户端组件，挂载时上报页面访问到 /api/track
 */
'use client';

import { useEffect } from 'react';

export default function PageViewTracker() {
  useEffect(() => {
    const send = (path: string) => {
      if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, referrer: document.referrer }),
          keepalive: true,
        }).catch(() => {});
        return;
      }
      try {
        navigator.sendBeacon(
          '/api/track',
          JSON.stringify({ path, referrer: document.referrer })
        );
      } catch {
        // ignore
      }
    };

    send(window.location.pathname);

    const handleRouteChange = (url: string) => {
      send(url);
    };

    window.addEventListener('popstate', () => {
      handleRouteChange(window.location.pathname);
    });

    return () => {
      send(window.location.pathname);
    };
  }, []);

  return null;
}
