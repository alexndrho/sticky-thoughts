import {
  Anchor,
  Box,
  Container,
  Flex,
  Footer,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconCopyright } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('lg')]: {
      flexDirection: 'column',
      gap: '1.5rem',
    },
  },

  copyRightText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
}));

const FooterBar = () => {
  const { classes } = useStyles();

  return (
    <Footer height="auto">
      <Container size="lg" py="xl">
        <Box className={classes.container}>
          <Box>
            <Title order={2} size="h3">
              Sticky
              <Text span c="blue.6" inherit>
                Thoughts
              </Text>
            </Title>

            <Text fz="sm" className={classes.copyRightText}>
              <IconCopyright size="1.25em" />

              <Box>
                2023{' '}
                <Anchor component={Link} to="/">
                  StickyThoughts
                </Anchor>
                . All rights reserved.
              </Box>
            </Text>
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
        </Box>
      </Container>
    </Footer>
  );
};

export default FooterBar;
