import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
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
import Thoughts from '../components/Thoughts';
import IThought from '../types/IThought';
import ScrollUpButton from '../components/ScrollUpButton';

const THOUGHTS_PER_ROW = 4;
const THOUGHTS_PER_PAGE = THOUGHTS_PER_ROW * 3;

interface IHome {
  title: string;
}

const Home = ({ title }: IHome) => {
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

  // callbacks
  const fetchInitialThoughts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        thoughtsCollectionRef,
        orderBy('createdAt', 'desc'),
        limit(THOUGHTS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);

      setThoughts(
        querySnapshot.docs.map((doc) => ({
          ...(doc.data() as IThought),
          id: doc.id,
        }))
      );

      const snapshot = await getCountFromServer(thoughtsCollectionRef);
      setTotalThoughts(snapshot.data().count);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const fetchNextPageThoughts = useCallback(async () => {
    if (!thoughts.length) return;

    setLoading(true);
    try {
      const q = query(
        thoughtsCollectionRef,
        orderBy('createdAt', 'desc'),
        where('createdAt', '<', thoughts[thoughts.length - 1].createdAt),
        limit(THOUGHTS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);

      setThoughts([
        ...thoughts,
        ...querySnapshot.docs.map((doc) => ({
          ...(doc.data() as IThought),
          id: doc.id,
        })),
      ]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [thoughts]);

  //useEffect
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    fetchInitialThoughts().catch((error) => {
      console.error(error);
    });
  }, [fetchInitialThoughts]);

  useEffect(() => {
    function handleScroll() {
      if (!thoughts.length) return;

      if (
        totalThoughts > thoughts.length &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      ) {
        fetchNextPageThoughts().catch((error) => {
          console.error(error);
        });
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchNextPageThoughts, thoughts, totalThoughts]);

  // effects
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
          void fetchInitialThoughts();
        }}
      />

      <ScrollUpButton />
    </>
  );
};

export default Home;
