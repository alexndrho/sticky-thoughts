import { Center, Container } from "@mantine/core";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Center w="100%" h="100%">
      <Container w={420}>{children}</Container>
    </Center>
  );
}
