import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

import { worker } from './mocks/browser';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4'
import * as Sentry from '@sentry/react'
import ChannelService from './channelTalk/channelService';

if (process.env.NODE_ENV === 'development') {
    worker.start();
  }

ReactGA.initialize('G-Q44DBL2GVC')

Sentry.init({
    dsn: "https://50877628c33666f49b979b6bcfbf12d1@o4505627412987904.ingest.sentry.io/4505627415150592",
    integrations: [
      new Sentry.BrowserTracing(),
      //new Sentry.Replay(),
    ],
    // Performance Monitoring
    //tracesSampleRate: 0.5, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    //replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    //replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  ChannelService.loadScript();
    ChannelService.boot({
        "pluginKey": "3ba503c9-c95d-4119-b1a6-fa80b408507f", // fill your plugin key
      });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);