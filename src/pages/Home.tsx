import { useEffect, useRef, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import {
  Button,
  Container,
  Flex,
  Group,
  Input,
  Kbd,
  Loader,
} from '@mantine/core';
import { useDebouncedState, useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconMessage, IconSearch } from '@tabler/icons-react';

import { thoughtsCollectionRef } from '../api/firebase';
import SendThoughtModal from '../components/SendThoughtModal';
import NavBar from '../components/NavBar';
import Thoughts from '../components/Thoughts';
import IThought from '../types/IThought';
import ScrollUpButton from '../components/ScrollUpButton';
import {
  fetchInitialThoughts,
  getMoreThoughts,
  getThoughtsCount,
} from '../services/thought';

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
      if (!thoughts.length) return;

      if (
        totalThoughts > thoughts.length &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      ) {
        setLoading(true);

        getMoreThoughts(thoughts[thoughts.length - 1].createdAt)
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
  }, [thoughts, totalThoughts]);

  useEffect(() => {
    const value = searchBarValue.toLowerCase();

    if (value.length === 0) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    const q = query(
      thoughtsCollectionRef,
      orderBy('createdAt', 'desc'),
      where('lowerCaseAuthor', '==', value)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setSearchResults([]);

        setLoading(false);
      } else {
        setSearchResults(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as IThought),
            id: doc.id,
          }))
        );

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [searchBarValue]);

  return (
    <>
      <NavBar />

      <Container role="main" size="lg" py="lg">
        <Flex mb="lg" gap="md">
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
      </Container>

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

      <ScrollUpButton />
    </>
  );
};

export default Home;
