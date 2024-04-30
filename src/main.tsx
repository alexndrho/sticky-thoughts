import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
