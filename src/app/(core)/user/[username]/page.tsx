"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { userUsernameOptions } from "@/app/(core)/user/options";
import Content from "./Content";
import ContentSkeleton from "@/components/ContentSkeleton";
import NotFoundContent from "@/components/NotFoundContent";

export default function UserPage() {
  const params = useParams<{ username: string }>();

  const { data: user, isLoading: isUserLoading } = useQuery(
    userUsernameOptions(params.username),
  );

  if (user) {
    return <Content user={user} />;
  } else if (isUserLoading) {
    return <ContentSkeleton />;
  }

  return <NotFoundContent />;
}
