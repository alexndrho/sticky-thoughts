"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  Skeleton,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconPhoto,
  IconRosetteDiscountCheckFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import UploadProfilePictureModal from "@/components/user/UploadProfilePictureModal";
import UpdateUsernameModal from "@/components/user/UpdateUsernameModal";
import UpdateNameModal from "@/components/user/UpdateNameModal";

import { authClient } from "@/lib/auth-client";
import { removeProfilePicture } from "@/services/user";
import classes from "@/styles/settings.module.css";
import { secondsToMinutesExtended } from "@/utils/date";

const emailVerificationSentTimeout = 3 * 60 * 1000; // 3 minutes

export default function SettingsPage() {
  const router = useRouter();

  const [emailVerificationTimerCountdown, setEmailVerificationTimerCountdown] =
    useState(0);

  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);

  const {
    data: session,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = authClient.useSession();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/");
    }
  }, [isSessionPending, session, router]);

  const [
    uploadProfilePictureModalOpened,
    {
      open: openUploadProfilePictureModal,
      close: closeUploadProfilePictureModal,
    },
  ] = useDisclosure(false);

  const [
    updateUsernameModalOpened,
    { open: openUpdateUsernameModal, close: closeUpdateUsernameModal },
  ] = useDisclosure(false);

  const [
    updateEmailModalOpened,
    { open: openUpdateEmailModal, close: closeUpdateEmailModal },
  ] = useDisclosure(false);

  const handleRemoveProfilePicture = async () => {
    await removeProfilePicture();
    refetchSession();
  };

  const emailVerificationMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No session found");

      const response = await authClient.sendVerificationEmail({
        email: session.user.email,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
    },

    onSuccess: () => {
      notifications.show({
        title: "Verification Email Sent",
        message: "Please check your email to verify your email address.",
        color: "green",
        icon: <IconCheck />,
      });

      setIsEmailVerificationSent(true);
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
        icon: <IconX />,
      });
    },
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isEmailVerificationSent) {
      setEmailVerificationTimerCountdown(emailVerificationSentTimeout / 1000);

      interval = setInterval(() => {
        setEmailVerificationTimerCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsEmailVerificationSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEmailVerificationSent]);

  const accountItems = [
    {
      label: "Name",
      value: session?.user?.name,
      rightSection: (
        <Button
          variant="default"
          size="compact-md"
          onClick={openUpdateEmailModal}
        >
          Edit
        </Button>
      ),
    },
    {
      label: "Email",
      description: "This will not be shown to other users",
      value: (
        <>
          {session?.user?.email}

          {session?.user.emailVerified && (
            <IconRosetteDiscountCheckFilled color="var(--mantine-color-green-6)" />
          )}
        </>
      ),
      rightSection: (
        <>
          <Tooltip label="Not available yet" withArrow>
            <Button variant="default" size="compact-md" disabled>
              Edit
            </Button>
          </Tooltip>

          {!session?.user.emailVerified && (
            <Button
              size="compact-md"
              w={isEmailVerificationSent ? 53 : "auto"}
              disabled={isEmailVerificationSent}
              loading={emailVerificationMutation.isPending}
              onClick={() => emailVerificationMutation.mutate()}
            >
              {isEmailVerificationSent
                ? secondsToMinutesExtended(emailVerificationTimerCountdown)
                : "Verify"}
            </Button>
          )}
        </>
      ),
    },
    {
      label: "Username",
      value: session?.user?.username,
      rightSection: (
        <Button
          variant="default"
          size="compact-md"
          onClick={openUpdateUsernameModal}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box my="xl" w="100%">
      <Title order={1} size="h2" mb="xs">
        Account
      </Title>

      <Divider mb="lg" />

      <Flex
        direction={{ base: "column-reverse", sm: "row" }}
        justify="space-between"
        align={{ base: "center", sm: "start" }}
        gap="xl"
      >
        <Flex
          flex={{ base: 0, sm: 1 }}
          direction="column"
          w={{ base: "100%", sm: "auto" }}
          maw={{ base: "none", sm: 720 }}
          gap="lg"
        >
          {accountItems.map((item, index) => (
            <Flex
              key={index}
              w="100%"
              justify="space-between"
              align="end"
              gap="md"
            >
              <Box>
                <Text
                  size="lg"
                  fw="bold"
                  truncate
                  style={{
                    lineHeight: item.description
                      ? "var(--mantine-line-height-xs)"
                      : undefined,
                  }}
                >
                  {item.label}
                </Text>

                {item.description && (
                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>
                )}

                <Skeleton w="auto" miw={150} visible={isSessionPending}>
                  <Text
                    truncate
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {item.value || "No value set"}
                  </Text>
                </Skeleton>
              </Box>

              <Skeleton w="auto" visible={isSessionPending}>
                <Flex w={125} justify="end" gap="sm">
                  {item.rightSection}
                </Flex>
              </Skeleton>
            </Flex>
          ))}
        </Flex>

        <div className={classes["profile-picture-container"]}>
          <Avatar src={session?.user?.image} w={200} h={200} />

          <Menu withArrow>
            <Menu.Target>
              <Button
                variant="default"
                className={classes["profile-picture-container__edit-button"]}
                size="compact-md"
                leftSection={<IconEdit size="1em" />}
              >
                Edit
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPhoto size="1em" />}
                onClick={openUploadProfilePictureModal}
              >
                Upload a photo
              </Menu.Item>

              {session?.user?.image && (
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size="1em" />}
                  onClick={handleRemoveProfilePicture}
                >
                  Remove photo
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </div>
      </Flex>

      <UploadProfilePictureModal
        opened={uploadProfilePictureModalOpened}
        onClose={closeUploadProfilePictureModal}
      />

      <UpdateNameModal
        opened={updateEmailModalOpened}
        onClose={closeUpdateEmailModal}
      />

      <UpdateUsernameModal
        opened={updateUsernameModalOpened}
        onClose={closeUpdateUsernameModal}
      />
    </Box>
  );
}
