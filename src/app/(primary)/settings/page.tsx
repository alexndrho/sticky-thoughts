"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Avatar, Box, Button, Flex, Text, Title, Tooltip } from "@mantine/core";

import { getSettingsInfo } from "@/services/user";
import UpdateUsernameModal from "@/components/user/UpdateUsernameModal";
import UpdateNameModal from "@/components/user/UpdateNameModal";

export default function Settings() {
  const { data: session } = useSession();

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
      <Title mb="xl">Settings</Title>

      <Flex gap="xl">
        <Flex flex={1} direction="column" gap="lg">
          {accountItems.map((item, index) => (
            <Flex
              key={index}
              maw={500}
              justify="space-between"
              align="end"
              gap="md"
            >
              <Box>
                <Text size="lg" fw="bold" truncate>
                  {item.label}
                </Text>

                <Text truncate>{item.value || "No value set"}</Text>
              </Box>

              {item.action}
            </Flex>
          ))}
        </Flex>

        <Avatar src={session?.user?.image ?? undefined} w={200} h={200} />
      </Flex>

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
