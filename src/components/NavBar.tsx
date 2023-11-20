import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Text,
  createStyles,
  useMantineColorScheme,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconSun,
  IconMoon,
  IconMenu,
  IconHome,
  IconAddressBook,
  IconInfoCircle,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  logo: {
    userSelect: 'none',
  },

  container: {
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto auto',
    gridGap: '1rem',
  },

  groupLink: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  hamburgerMenu: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
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
        <Text component={Link} to="/" fz="xl" fw={700} className={classes.logo}>
          Sticky
          <Text span c="blue.6" inherit>
            Thoughts
          </Text>
        </Text>

        <Group className={classes.groupLink}>
          <Button component={Link} to="/" variant="subtle" compact>
            Home
          </Button>

          <Button variant="subtle" compact>
            About
          </Button>

          <Button variant="subtle" compact>
            Contact
          </Button>
        </Group>

        <Box className={classes.hamburgerMenu}>
          <Menu shadow="md" width={110}>
            <Menu.Target>
              <ActionIcon aria-label="toggle menu" variant="default" size="lg">
                <IconMenu size="1em" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item component={Link} to="/" icon={<IconHome size="1em" />}>
                Home
              </Menu.Item>
              <Menu.Item icon={<IconInfoCircle size="1em" />}>About</Menu.Item>
              <Menu.Item icon={<IconAddressBook size="1em" />}>
                Contact
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>

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
