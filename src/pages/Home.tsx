import { useEffect, useRef } from 'react';
import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { nprogress } from '@mantine/nprogress';
import { Box, Button, Flex, Group, Input, Kbd, Loader } from '@mantine/core';
import { useDebouncedState, useDisclosure, useHotkeys } from '@mantine/hooks';
import AppContainer from '../components/AppContainer';
import SendThoughtModal from '../components/SendThoughtModal';
import Thoughts from '../components/Thoughts';
import { fetchThoughts, searchThoughts } from '../utils/thought';
import { IconMessage, IconSearch } from '@tabler/icons-react';

import { Timestamp } from 'firebase/firestore';

interface HomeProps {
  title: string;
}

const Home = ({ title }: HomeProps) => {
  const [messageOpen, { open, close }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState('', 250);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['thoughts'],
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 5,
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<QueryKey, Timestamp | undefined>) => {
      const thoughts = await fetchThoughts(pageParam);
      nprogress.complete();

      return thoughts;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;

      return lastPage[lastPage.length - 1].createdAt;
    },
  });

  const { data: searchData, isFetching: isSearchFetching } = useQuery({
    queryKey: ['thoughts', 'search', searchBarValue],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!searchBarValue) return [];

      return searchThoughts(searchBarValue);
    },
    enabled: Boolean(searchBarValue),
  });

  const focusSearchBar = () => {
    searchRef.current?.focus();
  };

  useHotkeys([['t', focusSearchBar]]);

  //useEffect
  useEffect(() => {
    document.title = title;
  }, [title]);

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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, fetchNextPage, hasNextPage, searchBarValue.length]);

  return (
    <AppContainer>
      <Box mih="100dvh">
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
              rightSection: { pointerEvents: 'none' },
            })}
          />

          <Button rightSection={<IconMessage size="1em" />} onClick={open}>
            Post
          </Button>
        </Flex>

        {searchRef.current?.value
          ? searchData && <Thoughts thoughts={searchData} />
          : data && (
              <Thoughts
                thoughts={data.pages.reduce(
                  (acc, page) => acc.concat(page),
                  []
                )}
              />
            )}

        <Group my="xl" h="2.25rem" justify="center">
          {(isFetching || isSearchFetching) && <Loader />}
        </Group>
      </Box>

      <SendThoughtModal open={messageOpen} onClose={close} />
    </AppContainer>
  );
};

export default Home;
