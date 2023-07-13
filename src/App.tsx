import { useEffect, useRef, useState } from 'react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Button, Container, Flex, Group, Input, Loader } from '@mantine/core';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { IconMessage, IconSearch } from '@tabler/icons-react';

import { thoughtsCollectionRef } from './api/firebase';
import NavBar from './components/NavBar';
import SendThoughtModal from './components/SendThoughtModal';
import Thoughts from './components/Thoughts';
import IThought from './types/IThought';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [messageOpen, { open, close }] = useDisclosure(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchBarValue, setSearchBarValue] = useDebouncedState('', 250);

  const [thoughts, setThoughts] = useState<IThought[]>([]);
  const [searchResults, setSearchResults] = useState<IThought[]>([]);

  useEffect(() => {
    setLoading(true);
    const q = query(thoughtsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setThoughts(
        snapshot.docs.map((doc) => ({
          ...(doc.data() as IThought),
          id: doc.id,
        }))
      );

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const value = searchBarValue.toLowerCase();
    console.log(value);

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
      } else {
        setSearchResults(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as IThought),
            id: doc.id,
          }))
        );
      }
    });

    setLoading(false);
    return () => unsubscribe();
  }, [searchBarValue]);

  return (
    <>
      <NavBar />

      <Container role="main" size="lg" py="2.5rem">
        <Flex mb="xl" gap="md">
          <Input
            ref={searchRef}
            icon={<IconSearch size="1em" />}
            placeholder="Search for an author"
            onChange={(e) => setSearchBarValue(e.currentTarget.value)}
            styles={() => ({
              wrapper: {
                flex: 1,
              },
            })}
          />

          <Button rightIcon={<IconMessage size="1em" />} onClick={open}>
            Post
          </Button>
        </Flex>

        {loading ? (
          <Group my="xl" position="center">
            <Loader />
          </Group>
        ) : searchRef.current?.value ? (
          <Thoughts thoughts={searchResults} />
        ) : (
          <Thoughts thoughts={thoughts} />
        )}
      </Container>

      <SendThoughtModal open={messageOpen} onClose={close} />
    </>
  );
};

export default App;
