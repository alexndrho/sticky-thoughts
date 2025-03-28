"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconMenu,
  IconHome,
  IconAddressBook,
  IconInfoCircle,
  IconUser,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { useThrottledCallback } from "@mantine/hooks";

import { getQueryClient } from "@/app/providers";

export default function Nav() {
  const { data: session } = useSession();

  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();

  const handleRefetch = useThrottledCallback(() => {
    getQueryClient().invalidateQueries({
      queryKey: ["thoughts"],
    });
  }, 10000);

  return (
    <Box
      component="header"
      style={{
        borderBottom: `${rem(1)} solid var(--mantine-color-default-border)`,
      }}
    >
      <Container h="4rem" size="xl">
        <Group h="100%" justify="space-between">
          <Text
            component={Link}
            href="/"
            fz="xl"
            fw={700}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                handleRefetch();
              }
            }}
          >
            Sticky
            <Text span c="blue.6" inherit>
              Thoughts
            </Text>
          </Text>

          <Group>
            <Group component="nav" display={{ base: "none", md: "flex" }}>
              <Button
                component={Link}
                href="/"
                variant="subtle"
                size="compact-sm"
              >
                Home
              </Button>

              <Button
                component={Link}
                href="/about"
                variant="subtle"
                size="compact-sm"
              >
                About
              </Button>

              <Button
                component={Link}
                href="/contact"
                variant="subtle"
                size="compact-sm"
              >
                Contact
              </Button>

              <Divider orientation="vertical" />

              {session?.user ? (
                <Menu>
                  <Menu.Target>
                    <Avatar component={UnstyledButton} />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size="1em" />}
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/signup"
                    variant="outline"
                    size="compact-sm"
                  >
                    Signup
                  </Button>
                  <Button component={Link} href="/login" size="compact-sm">
                    Login
                  </Button>
                </>
              )}
            </Group>

            <Box display={{ base: "block", md: "none" }}>
              <Menu shadow="md" width={110}>
                <Menu.Target>
                  <ActionIcon
                    aria-label="toggle menu"
                    variant="default"
                    size="lg"
                  >
                    <IconMenu size="1em" />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    href="/login"
                    leftSection={<IconLogin size="1em" />}
                  >
                    Login
                  </Menu.Item>

                  <Menu.Item
                    component={Link}
                    href="/signup"
                    leftSection={<IconUser size="1em" />}
                  >
                    Signup
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    component={Link}
                    href="/"
                    leftSection={<IconHome size="1em" />}
                  >
                    Home
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/about"
                    leftSection={<IconInfoCircle size="1em" />}
                  >
                    About
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/contact"
                    leftSection={<IconAddressBook size="1em" />}
                  >
                    Contact
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Box>

            <Tooltip label="Dark mode" position="bottom" className="darkHidden">
              <ActionIcon
                aria-label="Toggle color scheme"
                variant="default"
                size="lg"
                onClick={() => setColorScheme("dark")}
              >
                <IconMoon size="1em" />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label="Light mode"
              position="bottom"
              className="lightHidden"
            >
              <ActionIcon
                aria-label="Toggle color scheme"
                variant="default"
                size="lg"
                onClick={() => setColorScheme("light")}
              >
                <IconSun size="1em" />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
