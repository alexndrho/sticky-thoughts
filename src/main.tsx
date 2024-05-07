import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import { NavigationProgress } from '@mantine/nprogress';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="auto" />
    <MantineProvider defaultColorScheme="auto">
      <NavigationProgress />
      <Notifications />

      <App />
    </MantineProvider>
  </React.StrictMode>
);
