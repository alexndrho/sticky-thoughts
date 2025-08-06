import type { User } from "@prisma/client";
import { Avatar, Box, Flex, Tabs, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMessage } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import Threads from "./ThreadsTab";
import SignInWarningModal from "@/components/SignInWarningModal";

export interface ContentProps {
  user: User;
}

export default function Content({ user }: ContentProps) {
  const { data: session } = authClient.useSession();

  const [signInWarningModalOpened, signInWarningModalHandler] =
    useDisclosure(false);

  return (
    <>
      <Flex py="xl" align="center">
        <Avatar size="xl" src={user.image} />

        <Box ml="md">
          <Title size="h2" fw="bold">
            {user.name || user.username}
          </Title>

          <Text size="lg">@{user.username}</Text>
        </Box>
      </Flex>

      <Tabs variant="outline" defaultValue="threads">
        <Tabs.List>
          <Tabs.Tab value="threads" leftSection={<IconMessage size="1em" />}>
            Threads
          </Tabs.Tab>
        </Tabs.List>

        <Threads
          username={user.username}
          session={session}
          openSignInWarningModal={signInWarningModalHandler.open}
        />
      </Tabs>

      {!session && (
        <SignInWarningModal
          opened={signInWarningModalOpened}
          onClose={signInWarningModalHandler.close}
        />
      )}
    </>
  );
}
