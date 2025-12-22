"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  Anchor,
  Box,
  Button,
  Divider,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrandGoogleFilled, IconX } from "@tabler/icons-react";
import classes from "../captcha.module.css";

import { authClient } from "@/lib/auth-client";
import { AuthContainer } from "../AuthContainer";

export default function Content() {
  const router = useRouter();
  const turnstileRef = useRef<TurnstileInstance>(null);

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      turnstileToken: "",
    },
    validate: {
      email: isEmail("Invalid email"),
      username: isNotEmpty("Username is required"),
      password: isNotEmpty("Password is required"),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      authClient.signUp.email({
        name: "",
        ...values,
        callbackURL: "/",
        fetchOptions: {
          headers: {
            "x-captcha-response": values.turnstileToken,
          },
        },
      }),

    onSuccess: ({ error }) => {
      if (error) {
        form.setFieldError("root", error.message);

        form.setFieldValue("turnstileToken", "");
        turnstileRef.current?.reset();
        return;
      }

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
          Sign up
        </Title>

        <Text size="sm" c="dimmed" ta="center">
          Already have an account?{" "}
          <Anchor component={Link} href="/sign-in">
            Sign in
          </Anchor>
        </Text>
      </Box>

      <AuthContainer>
        <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
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

          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
            className={classes.captcha}
            onSuccess={(token) => form.setFieldValue("turnstileToken", token)}
            onExpire={() => turnstileRef.current?.reset()}
            onError={() =>
              form.setFieldError(
                "turnstileToken",
                "Captcha verification failed",
              )
            }
          />

          {(form.errors.root || form.errors.turnstileToken) && (
            <Text mt="xs" size="xs" c="red.8">
              {form.errors.root || form.errors.turnstileToken}
            </Text>
          )}

          <Button
            fullWidth
            mt="lg"
            type="submit"
            loading={mutation.isPending}
            disabled={form.values.turnstileToken === ""}
          >
            Sign up
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
