import { Container } from '@mantine/core';
import Nav from './Nav';
import Footer from './Footer';
import ScrollUpButton from '../components/ScrollUpButton';

interface AppContainerProps {
  children: React.ReactNode;
}

function AppContainer({ children }: AppContainerProps) {
  return (
    <>
      <Nav />
      <Container component="main" size="lg">
        {children}
      </Container>

      <ScrollUpButton />
      <Footer />
    </>
  );
}

export default AppContainer;
