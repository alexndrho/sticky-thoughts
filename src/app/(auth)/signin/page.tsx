"use client";

import { Box, Button, Paper, Text, Title } from "@mantine/core";

import { signIn } from "next-auth/react";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export default function Login() {
  return (
    <RedirectIfAuthenticated>
      <Box mb="xl">
        <Title mb="xs" ta="center">
          Welcome back!
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          Sign in to your account
        </Text>
      </Box>

      <Paper p={30} shadow="md" radius="md" withBorder>
        <Button
          variant="default"
          size="md"
          fullWidth
          leftSection={<IconBrandGoogleFilled />}
          onClick={async () => {
            await signIn("google");
          }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </RedirectIfAuthenticated>
  );
}
