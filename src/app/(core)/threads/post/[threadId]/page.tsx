"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { threadPostOptions } from "@/lib/query/options/thread";
import Content from "./Content";
import ContentSkeleton from "./ContentSkeleton";
import { NotFoundContent } from "@/app/not-found";

export default function PostPage() {
  const params = useParams<{ threadId: string }>();

  const query = useQuery(threadPostOptions(params.threadId));

  if (query.data) {
    return <Content id={query.data.id} thread={query.data} />;
  } else if (query.isLoading) {
    return <ContentSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
