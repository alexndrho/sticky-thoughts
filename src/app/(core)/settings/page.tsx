"use client";

import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
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
import { IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";

import UploadProfilePictureModal from "@/components/user/UploadProfilePictureModal";
import UpdateUsernameModal from "@/components/user/UpdateUsernameModal";
import UpdateNameModal from "@/components/user/UpdateNameModal";

import { authClient } from "@/lib/auth-client";
import { removeProfilePicture } from "@/services/user";
import classes from "@/styles/settings.module.css";
import { useEffect } from "react";

export default function Settings() {
  const router = useRouter();

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

  const accountItems = [
    {
      label: "Name",
      value: session?.user?.name,
      action: (
        <Button variant="default" onClick={openUpdateEmailModal}>
          Edit
        </Button>
      ),
    },
    {
      label: "Email",
      description: "This will not be shown to other users",
      value: session?.user?.email,
      action: (
        <Tooltip label="Not available yet" withArrow>
          <Button variant="default" disabled>
            Edit
          </Button>
        </Tooltip>
      ),
    },
    {
      label: "Username",
      value: session?.user?.username,
      action: (
        <Button variant="default" onClick={openUpdateUsernameModal}>
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
        align={{ base: "center", sm: "start" }}
        gap="xl"
      >
        <Flex
          flex={{ base: 0, sm: 1 }}
          direction="column"
          w={{ base: "100%", sm: "auto" }}
          gap="lg"
        >
          {accountItems.map((item, index) => (
            <Flex
              key={index}
              maw={{ base: "none", sm: 500 }}
              w="100%"
              justify="space-between"
              align="end"
              gap="md"
            >
              <Box miw={0}>
                <Text size="lg" fw="bold" truncate>
                  {item.label}
                </Text>

                {item.description && (
                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>
                )}

                <Skeleton w="auto" miw={150} visible={isSessionPending}>
                  <Text truncate>{item.value || "No value set"}</Text>
                </Skeleton>
              </Box>

              <Skeleton w="auto" visible={isSessionPending}>
                {item.action}
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
