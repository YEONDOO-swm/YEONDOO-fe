import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

import { worker } from './mocks/browser';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4'
import * as Sentry from '@sentry/react'
import ChannelService from './channelTalk/channelService';

import { HelmetProvider } from 'react-helmet-async';
import { hydrateRoot } from 'react-dom/client';
import { render } from 'react-dom';

import { createStore } from "redux";
import { reducer } from './reducer';
import { composeWithDevTools } from '@redux-devtools/extension';
import { Provider } from "react-redux";

// if (process.env.NODE_ENV === 'development') {
//     worker.start();
//   }

ReactGA.initialize('G-Q44DBL2GVC')


Sentry.init({
    dsn: "https://50877628c33666f49b979b6bcfbf12d1@o4505627412987904.ingest.sentry.io/4505627415150592",
    environment: process.env.NODE_ENV,
    integrations: [
        new Sentry.BrowserTracing(),
        //new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1, // Capture 100% of the transactions, reduce in production!
    enabled: process.env.NODE_ENV !== 'development',

    // Session Replay
    //replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    //replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });



//   ChannelService.loadScript();
//     ChannelService.boot({
//         "pluginKey": "3ba503c9-c95d-4119-b1a6-fa80b408507f", // fill your plugin key
//       });

const store = createStore(
    reducer,
    composeWithDevTools(
      
      // other store enhancers if any
    ),
  );

const rootElement = document.getElementById('root');
const app = (
    <Provider store={store}>
        <React.StrictMode>
            <BrowserRouter>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </BrowserRouter>
        </React.StrictMode>
    </Provider>
)
let root = ReactDOM.createRoot(rootElement as HTMLElement);

if (rootElement?.hasChildNodes()) {
    // 이미 child nodes가 있는 경우, 기존 root를 사용하여 업데이트
    root.render(app);
} else {
    // child nodes가 없는 경우, root를 render로 초기화
    root.render(app);
}