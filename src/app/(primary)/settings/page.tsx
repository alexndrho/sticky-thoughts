"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
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

import { getSettingsInfo, removeProfilePicture } from "@/services/user";
import UploadProfilePictureModal from "@/components/user/UploadProfilePictureModal";
import UpdateUsernameModal from "@/components/user/UpdateUsernameModal";
import UpdateNameModal from "@/components/user/UpdateNameModal";
import classes from "@/styles/settings.module.css";
import { getQueryClient } from "@/app/providers";

export default function Settings() {
  const { data: session, update: updateSession } = useSession();

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

  const query = useQuery({
    queryKey: ["settings", session?.user?.id],
    queryFn: getSettingsInfo,
  });

  const handleRemoveProfilePicture = async () => {
    const image = await removeProfilePicture();

    updateSession({
      ...session?.user,
      user: {
        ...session?.user,
        picture: image,
      },
    });

    getQueryClient().setQueryData(["settings", session?.user?.id], (oldData) =>
      oldData
        ? {
            ...oldData,
            image,
          }
        : oldData,
    );
  };

  const accountItems = [
    {
      label: "Name",
      value: query.data?.name,
      action: (
        <Button variant="default" onClick={openUpdateEmailModal}>
          Edit
        </Button>
      ),
    },
    {
      label: "Username",
      value: query.data?.username,
      action: (
        <Button variant="default" onClick={openUpdateUsernameModal}>
          Edit
        </Button>
      ),
    },
    {
      label: "Email",
      description: "This will not be shown to other users",
      value: query.data?.email,
      action: (
        <Tooltip label="Not available yet" withArrow>
          <Button variant="default" disabled>
            Edit
          </Button>
        </Tooltip>
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

                <Skeleton w="auto" miw={150} visible={query.isLoading}>
                  <Text truncate>{item.value || "No value set"}</Text>
                </Skeleton>
              </Box>

              <Skeleton w="auto" visible={query.isLoading}>
                {item.action}
              </Skeleton>
            </Flex>
          ))}
        </Flex>

        <div className={classes["profile-picture-container"]}>
          <Avatar src={query.data?.image} w={200} h={200} />

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

              <Menu.Item
                color="red"
                leftSection={<IconTrash size="1em" />}
                onClick={handleRemoveProfilePicture}
              >
                Remove photo
              </Menu.Item>
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
