import { auth } from "@/lib/auth";
import { Center, Container } from "@mantine/core";
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
    <Center w="100%" h="100%">
      <Container w={420}>{children}</Container>
    </Center>
  );
}
