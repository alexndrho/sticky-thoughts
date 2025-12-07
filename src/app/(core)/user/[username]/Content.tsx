import { useMemo } from "react";
import { Avatar, Box, Flex, Tabs, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeart, IconMessage } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { User } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import Threads from "./ThreadsTab";
import SignInWarningModal from "@/components/SignInWarningModal";
import LikesTab from "./LikesTab";

export interface ContentProps {
  user: User;
}

export default function Content({ user }: ContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  const [signInWarningModalOpened, signInWarningModalHandler] =
    useDisclosure(false);

  const currentTab = useMemo(() => {
    const tab = searchParams.get("tab");
    if (tab === "threads" || tab === "likes") return tab;
    return "threads";
  }, [searchParams]);

  const setTab = (value: string | null) => {
    const next = value ?? "threads";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Flex py="xl" align="center">
        <Avatar size="xl" src={user.image} />

        <Box ml="md">
          <Title size="h2" fw="bold">
            {user.name || user.username}
          </Title>

          <Text size="lg">@{user.username}</Text>

          {user.bio && (
            <Text size="sm" c="dimmed">
              {user.bio}
            </Text>
          )}
        </Box>
      </Flex>

      <Tabs variant="outline" value={currentTab} onChange={setTab}>
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
          isActive={currentTab === "threads"}
          openSignInWarningModal={signInWarningModalHandler.open}
        />

        <LikesTab
          username={user.username}
          session={session}
          isActive={currentTab === "likes"}
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
