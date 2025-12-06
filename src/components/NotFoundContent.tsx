"use client";

import Link from "next/link";
import { Button, Flex, Text, Title } from "@mantine/core";

export default function NotFoundContent() {
  return (
    <Flex
      h="100%"
      py="7.5rem"
      direction="column"
      justify="center"
      align="center"
    >
      <Title c="blue" tt="uppercase">
        <Text span display="block" fz="5rem" ta="center" inherit>
          404
        </Text>
        Page Not Found
      </Title>

      <Text mt="md" fz="xl" ta="center">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </Text>

      <Button component={Link} href="/" mt="md" variant="default">
        Return to home
      </Button>
    </Flex>
  );
}
