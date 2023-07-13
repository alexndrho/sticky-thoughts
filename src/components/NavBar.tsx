import {
  ActionIcon,
  Container,
  Header,
  Text,
  createStyles,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

const useStyles = createStyles(() => ({
  logo: {
    userSelect: 'none',
  },

  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const NavBar = () => {
  const { classes } = useStyles();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Header height="4rem">
      <Container role="navigation" className={classes.container} size="xl">
        <Text fz="xl" fw={700} className={classes.logo}>
          Sticky
          <Text span c="blue.6" inherit>
            Thoughts
          </Text>
        </Text>

        <ActionIcon
          aria-label="toggle color scheme"
          variant="default"
          size="lg"
          onClick={() => toggleColorScheme()}
        >
          {isDark ? <IconMoon size="1em" /> : <IconSun size="1em" />}
        </ActionIcon>
      </Container>
    </Header>
  );
};

export default NavBar;
