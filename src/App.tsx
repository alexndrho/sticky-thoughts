import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home title="StickyThoughts | Online Freedom Wall" />,
  },
  {
    path: '/about',
    element: <About title="About - StickyThoughts | Online Freedom Wall" />,
  },
  {
    path: '/contact',
    element: <Contact title="Contact - StickyThoughts | Online Freedom Wall" />,
  },
  {
    path: '/terms-and-conditions',
    element: (
      <TermsConditions title="Terms and Conditions - StickyThoughts | Online Freedom Wall" />
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <PrivacyPolicy title="Privacy Policy - StickyThoughts | Online Freedom Wall" />
    ),
  },
  {
    path: '/disclaimer',
    element: (
      <Disclaimer title="Disclaimer - StickyThoughts | Online Freedom Wall" />
    ),
  },
  {
    path: '*',
    element: <NotFound title="404 - StickyThoughts | Online Freedom Wall" />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
