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
  Skeleton,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

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
      <Title order={2} mb="xs">
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
              maw={{ base: "100%", sm: 500 }}
              justify="space-between"
              align="end"
              gap="md"
            >
              <Flex direction="column" gap={5}>
                <Text size="lg" fw="bold" truncate>
                  {item.label}
                </Text>

                <Skeleton w="auto" miw={150} visible={query.isLoading}>
                  <Text truncate>{item.value || "No value set"}</Text>
                </Skeleton>
              </Flex>

              <Skeleton w="auto" visible={query.isLoading}>
                {item.action}
              </Skeleton>
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
