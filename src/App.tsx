import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppContainer from './components/AppContainer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <Home title="StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <About title="About - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <Contact title="Contact - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '/terms-and-conditions',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <TermsConditions title="Terms and Conditions - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <PrivacyPolicy title="Privacy Policy - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '/disclaimer',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <Disclaimer title="Disclaimer - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<AppContainer startLoading />}>
        <NotFound title="404 - StickyThoughts | Online Freedom Wall" />
      </Suspense>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
