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

import Thoughts from "@/app/(core)/Thoughts";
import SendThoughtModal from "./SendThoughtModal";
import {
  thoughtCountOptions,
  thoughtInfiniteOptions,
  thoughtSearchInfiniteOptions,
} from "@/lib/query/options/thought";

export default function HomePage() {
  const [messageOpen, { open, close, toggle }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);

  const {
    data: thoughtsData,
    fetchNextPage: fetchThoughtsNextPage,
    hasNextPage: hasThoughtsNextPage,
    isFetching: isThoughtsFetching,
    isRefetching: isThoughtsRefetching,
    isRefetchError: isThoughtsError,
  } = useInfiniteQuery(thoughtInfiniteOptions);

  const {
    data: searchData,
    fetchNextPage: fetchSearchNextPage,
    hasNextPage: hasSearchNextPage,
    isFetching: isSearchFetching,
    isRefetching: isSearchRefetching,
    isRefetchError: isSearchRefetchError,
  } = useInfiniteQuery(thoughtSearchInfiniteOptions(searchBarValue));

  const focusSearchBar = () => {
    searchRef.current?.focus();
  };

  useHotkeys([
    ["t", focusSearchBar],
    ["s", toggle],
  ]);

  const { data: thoughtsCountData, isFetched: thoughtsCountIsFetched } =
    useQuery(thoughtCountOptions);

  //useEffect
  useEffect(() => {
    function handleScroll() {
      if (isThoughtsFetching || isSearchFetching) return;

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500;

      if (!isNearBottom) return;

      if (searchBarValue.length > 0 && hasSearchNextPage) fetchSearchNextPage();

      if (searchBarValue.length === 0 && hasThoughtsNextPage)
        fetchThoughtsNextPage();
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    isThoughtsFetching,
    isSearchFetching,
    fetchThoughtsNextPage,
    fetchSearchNextPage,
    hasThoughtsNextPage,
    hasSearchNextPage,
    searchBarValue.length,
  ]);

  useEffect(() => {
    if (isThoughtsRefetching || isSearchRefetching) {
      notifications.show({
        id: "refetch-thoughts",
        loading: true,
        title: "Fetching new thoughts",
        message: "Please wait...",
        autoClose: false,
        withCloseButton: false,
      });
    } else if (!isThoughtsError || !isSearchRefetchError) {
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
  }, [
    isThoughtsRefetching,
    isSearchRefetching,
    isThoughtsError,
    isSearchRefetchError,
  ]);

  return (
    <>
      <Box mih="100dvh">
        <Center mt="lg">
          <Skeleton w="auto" h="auto" visible={!thoughtsCountIsFetched}>
            <Group gap={5}>
              <IconMessage />

              <Text fz="md" fw="bold">
                {thoughtsCountData?.toLocaleString()}{" "}
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
          ? searchData && (
              <Thoughts
                thoughts={searchData.pages.reduce((acc, page) =>
                  acc.concat(page),
                )}
              />
            )
          : thoughtsData && (
              <Thoughts
                thoughts={thoughtsData.pages.reduce(
                  (acc, page) => acc.concat(page),
                  [],
                )}
              />
            )}

        <Group my="xl" h="2.25rem" justify="center">
          {(isThoughtsFetching || isSearchFetching) && <Loader />}
        </Group>
      </Box>

      <SendThoughtModal open={messageOpen} onClose={close} />
    </>
  );
}
