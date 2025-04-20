"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      username: isNotEmpty("Username is required"),
      password: isNotEmpty("Password is required"),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.values) =>
      authClient.signIn.username({
        ...values,
      }),
    onSuccess: ({ error }) => {
      if (error) {
        if (error.code === "INVALID_USERNAME_OR_PASSWORD") {
          form.setErrors({
            username: error.message,
            password: error.message,
          });
        } else {
          form.setFieldError("root", error.message);
        }

        return;
      }

      router.push("/");
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
          Welcome back!
        </Title>
        <Text size="sm" c="dimmed" ta="center">
          Do not have an account yet?{" "}
          <Anchor component={Link} href="/sign-up">
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

          <Checkbox
            mt="md"
            label="Remember me"
            {...form.getInputProps("rememberMe", { type: "checkbox" })}
          />

          {form.errors.root && (
            <Text mt="xs" size="xs" c="red.8">
              {form.errors.root}
            </Text>
          )}

          <Button fullWidth mt="lg" type="submit" loading={mutation.isPending}>
            Log in
          </Button>
        </form>
      </Paper>
    </>
  );
}
