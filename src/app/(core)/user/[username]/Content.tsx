import { Avatar, Box, Flex, Tabs, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconMessage } from "@tabler/icons-react";

import type { User } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import Threads from "./ThreadsTab";
import SignInWarningModal from "@/components/SignInWarningModal";
import LikesTab from "./LikesTab";

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

          <Tabs.Tab value="likes" leftSection={<IconHeart size="1em" />}>
            Likes
          </Tabs.Tab>
        </Tabs.List>

        <Threads
          username={user.username}
          session={session}
          openSignInWarningModal={signInWarningModalHandler.open}
        />

        <LikesTab
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
