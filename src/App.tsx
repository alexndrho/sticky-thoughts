import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const App = () => {
  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={<Home title="StickyThoughts | Online Freedom Wall" />}
        />
        <Route
          path="/about"
          element={
            <About title="About - StickyThoughts | Online Freedom Wall" />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact title="Contact - StickyThoughts | Online Freedom Wall" />
          }
        />
      </Routes>
    </>
  );
};

export default App;
