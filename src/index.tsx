import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

import { worker } from './mocks/browser';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4'
import * as Sentry from '@sentry/react'

if (process.env.NODE_ENV === 'development') {
    worker.start();
  }

ReactGA.initialize('G-Q44DBL2GVC')

Sentry.init({
    dsn: "https://50877628c33666f49b979b6bcfbf12d1@o4505627412987904.ingest.sentry.io/4505627415150592",
    environment: 'production',
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["https://yeondoo.net"],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);