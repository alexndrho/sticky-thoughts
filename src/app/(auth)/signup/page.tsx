"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
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

import { signup } from "@/services/auth";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";
import { createUserInput } from "@/lib/validations/user";
import ServerError from "@/utils/error/ServerError";

export default function Signup() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: zodResolver(createUserInput),
  });

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) => signup(values),
    onSuccess: () => {
      form.reset();
      router.push("/login");
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        const issues = error.issues;

        issues.errors.forEach((issue) => {
          switch (issue.code) {
            case "auth/invalid-input":
              form.setFieldError("root", issue.message);
              break;
            case "auth/invalid-username":
              form.setFieldError("username", issue.message);
              break;
            case "auth/invalid-email":
              form.setFieldError("email", issue.message);
              break;
            case "auth/invalid-password":
              form.setFieldError("password", issue.message);
              break;
          }
        });
      } else {
        form.setErrors({ root: "An unknown error occurred" });
      }
    },
  });

  return (
    <RedirectIfAuthenticated>
      <Box mb={30}>
        <Title mb="xs" ta="center">
          Sign up
        </Title>

        <Text size="sm" c="dimmed" ta="center">
          Already have an account?{" "}
          <Anchor component={Link} href="/login">
            Login
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

          <TextInput
            mt="md"
            label="Email"
            withAsterisk
            {...form.getInputProps("email")}
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
            Sign up
          </Button>
        </form>
      </Paper>
    </RedirectIfAuthenticated>
  );
}
