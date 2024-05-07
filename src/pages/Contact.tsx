import { Button, Flex, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import AppContainer from '../components/AppContainer';
import { IconMail } from '@tabler/icons-react';

interface ContactProps {
  title: string;
}

const Contact = ({ title }: ContactProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <AppContainer>
      <Flex py="7.5rem" direction="column" justify="center" align="center">
        <Title ta="center" c="blue">
          Get in Touch
        </Title>

        <Text span fz="xl" fs="italic" ta="center" display="block">
          We would love to hear from you.
        </Text>

        <Text fz="xl" ta="center">
          If you have any questions, please feel free to reach out.
        </Text>

        <Flex my="md" align="center" gap="xs" fz="xl">
          <IconMail size="1.25em" />
          ho.alexander.g@gmail.com
        </Flex>

        <Button component="a" href="mailto:ho.alexander.g@gmail.com">
          Send a Mail
        </Button>
      </Flex>
    </AppContainer>
  );
};

export default Contact;
