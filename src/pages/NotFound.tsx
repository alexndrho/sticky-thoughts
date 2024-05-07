import { Button, Flex, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { nprogress } from '@mantine/nprogress';
import { Link } from 'react-router-dom';
import AppContainer from '../components/AppContainer';

interface NotFoundProps {
  title: string;
}

function NotFound({ title }: NotFoundProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    nprogress.complete();
  }, []);

  return (
    <AppContainer>
      <Flex py="7.5rem" direction="column" justify="center" align="center">
        <Title c="blue" tt="uppercase">
          <Text span display="block" fz="5rem" ta="center" inherit>
            404
          </Text>
          Page Not found
        </Title>

        <Text mt="md" fz="xl" ta="center">
          Sorry, we couldn't find the page you're looking for.
        </Text>

        <Button component={Link} to="/" mt="md" variant="default">
          Return to home
        </Button>
      </Flex>
    </AppContainer>
  );
}

export default NotFound;
