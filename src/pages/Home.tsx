import { useEffect, useRef, useState } from 'react';
import { nprogress } from '@mantine/nprogress';
import { Box, Button, Flex, Group, Input, Kbd, Loader } from '@mantine/core';
import { useDebouncedState, useDisclosure, useHotkeys } from '@mantine/hooks';
import AppContainer from '../components/AppContainer';
import SendThoughtModal from '../components/SendThoughtModal';
import Thoughts from '../components/Thoughts';
import IThought from '../types/IThought';
import { fetchThoughts, searchThoughts } from '../services/thought';
import { IconMessage, IconSearch } from '@tabler/icons-react';
import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';

interface HomeProps {
  title: string;
}

const Home = ({ title }: HomeProps) => {
  const [messageOpen, { open, close }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState('', 250);

  const [searchResults, setSearchResults] = useState<IThought[]>([]);
  const [loading, setLoading] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['thoughts'],
    initialPageParam: undefined,
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

  useEffect(() => {
    const value = searchBarValue;

    if (value.length === 0) {
      setSearchResults([]);
      return;
    }

    setSearchResults([]);

    setLoading(true);
    searchThoughts(value)
      .then((results) => {
        setLoading(false);
        setSearchResults(results);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [searchBarValue]);

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

        {searchRef.current?.value ? (
          <Thoughts thoughts={searchResults} />
        ) : (
          data && (
            <Thoughts
              thoughts={data.pages.reduce((acc, page) => acc.concat(page), [])}
            />
          )
        )}

        <Group my="xl" h="2.25rem" justify="center">
          {(isFetching || loading) && <Loader />}
        </Group>
      </Box>

      <SendThoughtModal open={messageOpen} onClose={close} />
    </AppContainer>
  );
};

export default Home;
