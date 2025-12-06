"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { threadOptions } from "@/app/(core)/threads/options";
import Content from "./Content";
import ContentSkeleton from "@/components/ContentSkeleton";
import NotFoundContent from "@/components/NotFoundContent";

export default function PostPage() {
  const params = useParams<{ threadId: string }>();

  const query = useQuery(threadOptions(params.threadId));

  if (query.data) {
    return <Content id={query.data.id} thread={query.data} />;
  } else if (query.isLoading) {
    return <ContentSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
