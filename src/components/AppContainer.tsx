import { Container } from '@mantine/core';
import { useEffect } from 'react';
import { nprogress } from '@mantine/nprogress';
import Nav from './Nav';
import Footer from './Footer';
import ScrollUpButton from '../components/ScrollUpButton';

interface AppContainerProps {
  startLoading?: boolean;
  children?: React.ReactNode;
}

function AppContainer({ startLoading, children }: AppContainerProps) {
  useEffect(() => {
    if (startLoading) nprogress.start();
  }, [startLoading]);

  return (
    <>
      <Nav />

      <Container component="main" mih={startLoading ? '100dvh' : ''} size="lg">
        {children}
      </Container>

      <ScrollUpButton />
      <Footer />
    </>
  );
}

export default AppContainer;
