import type { Metadata } from "next";
import { Button, Flex, Text, Title } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Contact - StickyThoughts | Online Freedom Wall",
};

export default function Contact() {
  return (
    <Flex
      h="100%"
      py="7.5rem"
      direction="column"
      justify="center"
      align="center"
    >
      <Title ta="center" c="blue">
        Get in Touch
      </Title>

      <Text span fz="xl" fs="italic" ta="center" display="block">
        We would love to hear from you.
      </Text>

      <Text fz="xl" ta="center">
        If you have any questions, please feel free to reach out.
      </Text>

      <Flex my="md" align="center" gap="xs" fz="xl">
        <IconMail size="1.25em" />
        ho.alexander.g@gmail.com
      </Flex>

      <Button component="a" href="mailto:ho.alexander.g@gmail.com">
        Send a Mail
      </Button>
    </Flex>
  );
}
