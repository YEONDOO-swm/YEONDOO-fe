import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';

import { worker } from './mocks/browser';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4'

if (process.env.NODE_ENV === 'development') {
    worker.start();
  }

ReactGA.initialize('G-Q44DBL2GVC')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);