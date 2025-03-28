"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import {
  Anchor,
  Box,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";
import { userLoginInput } from "@/lib/validations/user";

export default function Login() {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(userLoginInput),
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      const signInData = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (signInData?.error) {
        form.setFieldError("root", "Credentials are invalid");
      }
    },
  });

  return (
    <RedirectIfAuthenticated>
      <Box mb={30}>
        <Title mb="xs" ta="center">
          Welcome back!
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          Do not have an account yet?{" "}
          <Anchor component={Link} href="/signup">
            Create account{" "}
          </Anchor>
        </Text>
      </Box>

      <Paper p={30} mt={30} shadow="md" radius="md" withBorder>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <TextInput
            label="Username"
            withAsterisk
            {...form.getInputProps("username")}
          />

          <PasswordInput
            mt="md"
            label="Password"
            withAsterisk
            {...form.getInputProps("password")}
          />

          {form.errors.root && (
            <Text mt="xs" size="xs" c="red">
              {form.errors.root}
            </Text>
          )}

          <Button fullWidth mt="lg" type="submit" loading={mutation.isPending}>
            Log in
          </Button>
        </form>
      </Paper>
    </RedirectIfAuthenticated>
  );
}
