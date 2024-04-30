import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
