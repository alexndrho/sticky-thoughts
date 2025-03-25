"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Input,
  Kbd,
  Loader,
  rem,
  Skeleton,
  Text,
  Tooltip,
  VisuallyHidden,
} from "@mantine/core";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconMessage, IconSearch, IconX } from "@tabler/icons-react";

import Thoughts from "@/components/Thoughts";
import SendThoughtModal from "@/components/SendThoughtModal";
import { getThoughts, getThoughtsCount } from "@/services/thought";

export default function Home() {
  const [messageOpen, { open, close, toggle }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isRefetching,
    isRefetchError,
  } = useInfiniteQuery({
    queryKey: ["thoughts"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getThoughts({ lastId: pageParam }),
    getNextPageParam: (thoughts) => {
      if (thoughts.length === 0) return undefined;

      return thoughts[thoughts.length - 1].id;
    },
  });

  const { data: searchData, isFetching: isSearchFetching } = useQuery({
    queryKey: ["thoughts", "search", searchBarValue],
    queryFn: async () => {
      if (!searchBarValue) return [];

      return getThoughts({ searchTerm: searchBarValue });
    },
    enabled: Boolean(searchBarValue),
  });

  const focusSearchBar = () => {
    searchRef.current?.focus();
  };

  useHotkeys([
    ["t", focusSearchBar],
    ["s", toggle],
  ]);

  const { data: thoughtsCountData, isFetched: thoughtsCountIsFetched } =
    useQuery({
      queryKey: ["thoughts", "count"],
      queryFn: async () => {
        return await getThoughtsCount();
      },
    });

  //useEffect
  useEffect(() => {
    function handleScroll() {
      if (isFetching) return;

      if (
        searchBarValue.length === 0 &&
        hasNextPage &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 500
      ) {
        fetchNextPage().catch((error) => {
          console.error(error);
        });
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching, fetchNextPage, hasNextPage, searchBarValue.length]);

  useEffect(() => {
    if (isRefetching) {
      notifications.show({
        id: "refetch-thoughts",
        loading: true,
        title: "Fetching new thoughts",
        message: "Please wait...",
        autoClose: false,
        withCloseButton: false,
      });
    } else if (!isRefetchError) {
      notifications.update({
        id: "refetch-thoughts",
        loading: false,
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        title: "Thoughts updated",
        message: "New thoughts have been fetched",
        autoClose: 4000,
        withCloseButton: true,
      });
    } else {
      notifications.update({
        id: "refetch-thoughts",
        loading: false,
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        title: "Failed to reload thoughts",
        message: "Please try again later",
        autoClose: 4000,
        withCloseButton: true,
      });
    }
  }, [isRefetching, isRefetchError]);

  return (
    <>
      <Box mih="100dvh">
        <Center mt="lg">
          <Skeleton w="auto" h="auto" visible={!thoughtsCountIsFetched}>
            <Group gap={5}>
              <IconMessage />

              <Text fz="md" fw="bold">
                {thoughtsCountData}{" "}
                <Text span c="blue.6" inherit>
                  thoughts
                </Text>{" "}
                submitted
              </Text>
            </Group>
          </Skeleton>
        </Center>

        <Flex my="lg" gap="md">
          <Input
            ref={searchRef}
            leftSection={<IconSearch size="1rem" />}
            rightSection={<Kbd>t</Kbd>}
            placeholder="Search for an author"
            onChange={(e) => setSearchBarValue(e.currentTarget.value)}
            styles={() => ({
              wrapper: {
                flex: 1,
              },
              rightSection: { pointerEvents: "none" },
            })}
          />

          <Tooltip label={`Press (s) to stick`} position="bottom">
            <Button rightSection={<IconMessage size="1em" />} onClick={open}>
              Stick a thought
            </Button>
          </Tooltip>
        </Flex>

        <VisuallyHidden component="h1">Posts</VisuallyHidden>

        {searchRef.current?.value
          ? searchData && <Thoughts thoughts={searchData} />
          : data && (
              <Thoughts
                thoughts={data.pages.reduce(
                  (acc, page) => acc.concat(page),
                  [],
                )}
              />
            )}

        <Group my="xl" h="2.25rem" justify="center">
          {(isFetching || isSearchFetching) && <Loader />}
        </Group>
      </Box>

      <SendThoughtModal open={messageOpen} onClose={close} />
    </>
  );
}
