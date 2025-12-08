import type { Metadata } from "next";
import { Box, Flex, Image as MantineImage, Text, Title } from "@mantine/core";
import Image from "next/image";

import noteImg from "@/assets/note.svg";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Flex h="100%" py="lg" align="center" gap="md">
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
          StickyThoughts offers a platform where you can freely express yourself
          and share your thoughts and experiences with others. You have the
          option to remain anonymous or not. You can post anything that you want
          including your thoughts, experiences, and even your secrets. You can
          also read other people&apos;s notes. The notes can be customized by
          using different colors, and you can search for other people&apos;s
          notes by their names. There is no limit to the number of notes you can
          add.
        </Text>
        <Text mt="lg" fz="lg"></Text>
      </Box>

      <Box display={{ base: "none", xs: "block" }}>
        <MantineImage
          w={250}
          h={250}
          component={Image}
          src={noteImg}
          alt="logo"
        />
      </Box>
    </Flex>
  );
}
