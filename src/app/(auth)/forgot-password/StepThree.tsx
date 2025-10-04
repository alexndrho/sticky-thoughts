"use client";

import { useEffect } from "react";
import { Button, Center, Group, PasswordInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";

import { AuthContainer } from "../AuthContainer";
import { authClient } from "@/lib/auth-client";

interface StepThreeProps {
  email: string | null;
  verificationCode: string | null;
  nextStep: () => void;
  resetStep: () => void;
}

export default function StepThree({
  email,
  verificationCode,
  nextStep,
  resetStep,
}: StepThreeProps) {
  useEffect(() => {
    if (!email || !verificationCode) {
      resetStep();
    }
  }, [email, verificationCode]);

  const newPasswordForm = useForm({
    initialValues: {
      newPassword: "",
    },
    validate: {
      newPassword: isNotEmpty("Password is required"),
    },
  });

  const newPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      if (!email || !verificationCode) {
        newPasswordForm.setFieldError("newPassword", "Missing required info");
        return;
      }

      const { data, error } = await authClient.emailOtp.resetPassword({
        email,
        otp: verificationCode,
        password,
      });

      if (data?.success) {
        nextStep();
      } else if (error) {
        newPasswordForm.setFieldError("newPassword", error.message);
      } else {
        newPasswordForm.setFieldError(
          "newPassword",
          "Failed to reset password",
        );
      }
    },
    onError: () => {
      newPasswordForm.setFieldError("newPassword", "Failed to reset password");
    },
  });

  return (
    <Center>
      <AuthContainer>
        <Title order={2} size="h2" mb="md" ta="center">
          Enter your new password
        </Title>

        <form
          onSubmit={newPasswordForm.onSubmit((values) =>
            newPasswordMutation.mutate(values.newPassword),
          )}
        >
          <PasswordInput
            label="Your new password"
            placeholder="Enter your new password"
            withAsterisk
            {...newPasswordForm.getInputProps("newPassword")}
          />

          <Group mt="md" justify="end">
            <Button type="submit" loading={newPasswordMutation.isPending}>
              Change Password
            </Button>
          </Group>
        </form>
      </AuthContainer>
    </Center>
  );
}
