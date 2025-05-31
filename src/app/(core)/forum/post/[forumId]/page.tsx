"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { forumPostOptions } from "@/lib/query/options/forum";
import Content from "./Content";
import ContentSkeleton from "./ContentSkeleton";
import { NotFoundContent } from "@/app/not-found";

export default function PostPage() {
  const params = useParams<{ forumId: string }>();

  const query = useQuery(forumPostOptions(params.forumId));

  if (query.data) {
    return <Content id={query.data.id} forum={query.data} />;
  } else if (query.isLoading) {
    return <ContentSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
