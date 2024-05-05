import {
  Anchor,
  Box,
  Container,
  Flex,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconCopyright } from '@tabler/icons-react';

const Footer = () => {
  return (
    <Box
      component="footer"
      style={{
        borderTop: `${rem(1)} solid var(--mantine-color-default-border)`,
      }}
    >
      <Container h="auto" size="xl" py="xl">
        <Flex direction={{ base: 'column', lg: 'row' }} justify="space-between">
          <Box>
            <Title order={2} size="h3">
              Sticky
              <Text span c="blue.6" inherit>
                Thoughts
              </Text>
            </Title>

            <Group gap={5}>
              <IconCopyright size="1.25em" />

              <Text span fz="sm">
                2023{' '}
                <Anchor component={Link} to="/">
                  StickyThoughts
                </Anchor>
                . All rights reserved.
              </Text>
            </Group>
          </Box>

          <Flex direction="column">
            <Title order={2} size="h4">
              Contact
            </Title>

            <Anchor href="mailto:ho.alexander.g@gmail.com">
              ho.alexander.g@gmail.com
            </Anchor>

            <Anchor href="https://alexndrho.dev/" target="_blank">
              alexndrho.dev
            </Anchor>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
