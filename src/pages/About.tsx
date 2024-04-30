import {
  Anchor,
  Box,
  Container,
  Flex,
  Image,
  Text,
  Title,
} from '@mantine/core';
import NavBar from '../components/NavBar';
import Footer from '../components/FooterBar';
import noteImg from '../assets/note.svg';
import { useEffect } from 'react';

interface AboutProps {
  title: string;
}

const About = ({ title }: AboutProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <NavBar />

      <Container role="main" size="lg" py="7.5rem">
        <Flex align="center" gap="md">
          <Box>
            <Title>
              Sticky
              <Text span c="blue.6" inherit>
                Thoughts
              </Text>
              <Text span display="block" fz="xl" fs="italic">
                A place to share your thoughts.
              </Text>
            </Title>
            <Text mt="lg" fz="lg">
              StickyThoughts offers a platform where you can freely express
              yourself and share your thoughts and experiences with others. You
              have the option to remain anonymous or not. You can post anything
              that you want including your thoughts, experiences, and even your
              secrets. You can also read other people's notes. The notes can be
              customized by using different colors, and you can search for other
              people's notes by their names. There is no limit to the number of
              notes you can add.
            </Text>
            <Text mt="lg" fz="lg"></Text>
            <Text mt="lg" fz="lg">
              StickyThoughts is an open source project available on{' '}
              <Anchor
                href="https://github.com/alexndrho/sticky-thoughts"
                target="_blank"
                inherit
              >
                Github
              </Anchor>
              , created by{' '}
              <Anchor href="https://alexndrho.dev" target="_blank" inherit>
                Alexander Gabriel Ho
              </Anchor>
              . This online freedom wall serves as a platform to provide an
              emotional outlet for its users.
            </Text>
          </Box>

          <Box display={{ base: 'none', xs: 'block' }}>
            <Image src={noteImg} w={250} />
          </Box>
        </Flex>
      </Container>

      <Footer />
    </>
  );
};

export default About;
