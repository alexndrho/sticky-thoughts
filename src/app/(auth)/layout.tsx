import { auth } from "@/lib/auth";
import { Container, Flex } from "@mantine/core";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <Container w="100%" h="100%">
      <Flex
        w="100%"
        h="100%"
        direction="column"
        justify="center"
        align="center"
      >
        {children}
      </Flex>
    </Container>
  );
}
