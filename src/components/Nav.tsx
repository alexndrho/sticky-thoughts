"use client";

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
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { useThrottledCallback } from "@mantine/hooks";

import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/app/providers";
import classes from "@/styles/nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const { setColorScheme } = useMantineColorScheme();

  const { data: session } = authClient.useSession();

  const handleRefetch = useThrottledCallback(() => {
    getQueryClient().invalidateQueries({
      queryKey: ["thoughts"],
    });
  }, 10000);

  return (
    <Box component="header" className={classes.nav}>
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
            <Group component="nav" display={{ base: "none", xs: "flex" }}>
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
            </Group>

            {session ? (
              <Menu>
                <Menu.Target>
                  <Avatar
                    component={UnstyledButton}
                    src={session.user?.image}
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    href="/settings"
                    leftSection={<IconSettings size="1em" />}
                  >
                    Settings
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size="1em" />}
                    onClick={() => authClient.signOut()}
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <>
                <Button component={Link} href="/sign-in" size="compact-sm">
                  Sign in
                </Button>

                <Tooltip
                  label="Dark mode"
                  position="bottom"
                  className="darkHidden"
                >
                  <ActionIcon
                    aria-label="Toggle color scheme"
                    variant="default"
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
                    onClick={() => setColorScheme("light")}
                  >
                    <IconSun size="1em" />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
