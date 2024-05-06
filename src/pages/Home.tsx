import { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Group, Input, Kbd, Loader } from '@mantine/core';
import { useDebouncedState, useDisclosure, useHotkeys } from '@mantine/hooks';
import AppContainer from '../components/AppContainer';
import SendThoughtModal from '../components/SendThoughtModal';
import Thoughts from '../components/Thoughts';
import IThought from '../types/IThought';
import {
  fetchInitialThoughts,
  fetchMoreThoughts,
  getThoughtsCount,
  searchThoughts,
} from '../services/thought';
import { IconMessage, IconSearch } from '@tabler/icons-react';

interface HomeProps {
  title: string;
}

const Home = ({ title }: HomeProps) => {
  const [loading, setLoading] = useState(false);
  const [messageOpen, { open, close }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState('', 250);

  const [thoughts, setThoughts] = useState<IThought[]>([]);
  const [totalThoughts, setTotalThoughts] = useState(0);
  const [searchResults, setSearchResults] = useState<IThought[]>([]);

  const focusSearchBar = () => {
    searchRef.current?.focus();
  };

  useHotkeys([['t', focusSearchBar]]);

  //useEffect
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    setLoading(true);

    fetchInitialThoughts()
      .then(async (thoughts) => {
        setThoughts(thoughts);

        const count = await getThoughtsCount();
        setTotalThoughts(count);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (!thoughts.length || loading) return;

      if (
        searchBarValue.length === 0 &&
        totalThoughts > thoughts.length &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 500
      ) {
        setLoading(true);

        fetchMoreThoughts(thoughts[thoughts.length - 1].createdAt)
          .then((newThoughts) => {
            setThoughts([...thoughts, ...newThoughts]);

            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, thoughts, totalThoughts, searchBarValue.length]);

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
        setSearchResults(results);
        setLoading(false);
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
          <Thoughts thoughts={thoughts} />
        )}

        <Group my="xl" h="2.25rem" justify="center">
          {loading && <Loader />}
        </Group>
      </Box>

      <SendThoughtModal
        open={messageOpen}
        onClose={close}
        onSubmit={() => {
          fetchInitialThoughts()
            .then((thoughts) => {
              setThoughts(thoughts);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      />
    </AppContainer>
  );
};

export default Home;
