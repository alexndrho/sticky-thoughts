"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { userUsernameOptions } from "@/lib/query/options/user";
import Content from "./Content";
import ContentSkeleton from "@/components/ContentSkeleton";

export default function UserPage() {
  const params = useParams<{ username: string }>();

  const userQuery = useQuery(userUsernameOptions(params.username));

  return (
    <>
      {userQuery.data ? <Content user={userQuery.data} /> : <ContentSkeleton />}
    </>
  );
}
