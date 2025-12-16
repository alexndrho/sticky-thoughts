"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrandGoogleFilled, IconX } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/get-query-client";
import { AuthContainer } from "../AuthContainer";
import { notifications } from "@mantine/notifications";

export default function Content() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      emailOrUsername: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      emailOrUsername: isNotEmpty("Email or username is required"),
      password: isNotEmpty("Password is required"),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.values) => {
      if (isEmail()(values.emailOrUsername) === null) {
        return authClient.signIn.email({
          email: values.emailOrUsername,
          password: values.password,
          rememberMe: values.rememberMe,
        });
      } else {
        return authClient.signIn.username({
          username: values.emailOrUsername,
          password: values.password,
          rememberMe: values.rememberMe,
        });
      }
    },
    onSuccess: ({ error }) => {
      if (error) {
        if (
          error.code === "INVALID_EMAIL_OR_PASSWORD" ||
          error.code === "INVALID_USERNAME_OR_PASSWORD"
        ) {
          form.setErrors({
            emailOrUsername: error.message,
            password: error.message,
          });
        } else {
          form.setFieldError("root", error.message);
        }

        return;
      }

      const queryClient = getQueryClient();
      queryClient.clear();

      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      form.setFieldError("root", "An error occurred. Please try again.");
    },
  });

  const signInWithGoogle = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });

      if (data.error) {
        notifications.show({
          icon: <IconX size="1em" />,
          title: "Error",
          message: data.error.message,
          color: "red",
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        icon: <IconX size="1em" />,
        title: "Error",
        message: "An error occurred. Please try again.",
        color: "red",
      });
    }
  };

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

      <AuthContainer>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
          <TextInput
            label="Email or Username"
            withAsterisk
            {...form.getInputProps("emailOrUsername")}
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

          <Group mt="md" justify="space-between">
            <Checkbox
              label="Remember me"
              {...form.getInputProps("rememberMe", { type: "checkbox" })}
            />

            <Anchor component={Link} href="/forgot-password" size="sm">
              Forgot Password?
            </Anchor>
          </Group>

          <Button fullWidth mt="lg" type="submit" loading={mutation.isPending}>
            Sign in
          </Button>
        </form>

        <Divider my="md" label="Or continue with email" />

        <Button
          fullWidth
          variant="default"
          leftSection={<IconBrandGoogleFilled size="1em" />}
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </Button>
      </AuthContainer>
    </>
  );
}
