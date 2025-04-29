import Link from "next/link";
import {
  Anchor,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconCopyright } from "@tabler/icons-react";

import classes from "@/styles/footer.module.css";

export default function Footer() {
  return (
    <Box component="footer" className={classes.footer}>
      <Container h="auto" size="xl" py="xl">
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          gap="md"
        >
          <Box>
            <Title order={2} size="h3">
              Sticky
              <Text span c="blue.6" inherit>
                Thoughts
              </Text>
            </Title>

            <Group gap={5}>
              <IconCopyright size="1.25em" />

              <Text span fz="sm">
                2023{" "}
                <Anchor component={Link} href="/">
                  StickyThoughts
                </Anchor>
                . All rights reserved.
              </Text>
            </Group>

            <Group gap={5}>
              <Anchor component={Link} href="/terms-and-conditions" fz="sm">
                Terms and Conditions
              </Anchor>

              <Divider orientation="vertical" />

              <Anchor component={Link} href="/privacy-policy" fz="sm">
                Privacy Policy
              </Anchor>

              <Divider orientation="vertical" />

              <Anchor component={Link} href="/disclaimer" fz="sm">
                Disclaimer
              </Anchor>
            </Group>
          </Box>

          <Flex direction="column">
            <Title order={2} size="h4">
              Contact
            </Title>

            <Anchor href="mailto:ho.alexander.g@gmail.com">
              ho.alexander.g@gmail.com
            </Anchor>

            <Anchor href="https://alexndrho.dev/" target="_blank">
              alexndrho.dev
            </Anchor>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
