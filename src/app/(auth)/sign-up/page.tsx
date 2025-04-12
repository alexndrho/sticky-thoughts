"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import Link from "next/link";
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

import { authClient } from "@/lib/auth-client";

export default function Signup() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    validate: {
      email: (value) => (value.length < 1 ? "Email is required" : null),
      username: (value) => (value.length < 1 ? "Username is required" : null),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      authClient.signUp.email({ ...values, callbackURL: "/" }),
    onSuccess: ({ error }) => {
      if (error) {
        form.setFieldError("root", error.message);

        return;
      }
    },
    onError: (error) => {
      console.error(error);
      form.setFieldError("root", "An error occurred. Please try again.");
    },
  });

  return (
    <>
      <Box mb={30}>
        <Title mb="xs" ta="center">
          Sign up
        </Title>

        <Text size="sm" c="dimmed" ta="center">
          Already have an account?{" "}
          <Anchor component={Link} href="/sign-in">
            Sign in
          </Anchor>
        </Text>
      </Box>

      <Paper p={30} mt={30} shadow="md" radius="md" withBorder>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <TextInput label="Name" {...form.getInputProps("name")} />

          <TextInput
            mt="md"
            label="Email"
            description="This will not be shown publicly"
            withAsterisk
            {...form.getInputProps("email")}
          />

          <TextInput
            mt="md"
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
            <Text mt="xs" size="xs" c="red.8">
              {form.errors.root}
            </Text>
          )}

          <Button fullWidth mt="lg" type="submit" loading={mutation.isPending}>
            Sign up
          </Button>
        </form>
      </Paper>
    </>
  );
}
