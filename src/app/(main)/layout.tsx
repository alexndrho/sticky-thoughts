import { Box, Container, Flex } from "@mantine/core";

import Nav from "@/components/Nav";
import ScrollUpButton from "@/components/ScrollUpButton";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex mih="100dvh" direction="column">
      <Nav
      //  onRefetch={onRefetch}
      />

      <Box flex={1}>
        <Container component="main" size="lg">
          {children}
        </Container>
      </Box>

      <ScrollUpButton />
      <Footer />
    </Flex>
  );
}
