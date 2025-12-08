import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { userUsernameOptions } from "@/app/(core)/user/options";
import { getQueryClient } from "@/lib/get-query-client";
import Content from "./Content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  const queryClient = getQueryClient();

  try {
    const user = await queryClient.fetchQuery(
      userUsernameOptions(username, cookie ?? undefined),
    );

    return {
      title: `${user.name || user.username} (@${user.username})`,
    };
  } catch {
    notFound();
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const headerList = await headers();
  const cookie = headerList.get("cookie");

  const queryClient = getQueryClient();

  try {
    await queryClient.ensureQueryData(
      userUsernameOptions(username, cookie ?? undefined),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content username={username} />
    </HydrationBoundary>
  );
}
