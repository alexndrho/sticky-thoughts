"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { forumPostOptions } from "@/lib/query-options/forum";
import PostContent from "./PostContent";
import PostSkeleton from "./PostSkeleton";
import { NotFoundContent } from "@/app/not-found";

export default function PostPage() {
  const params = useParams<{ id: string }>();

  const query = useQuery(forumPostOptions(params.id));

  if (query.data) {
    return <PostContent id={query.data.id} post={query.data} />;
  } else if (query.isLoading) {
    return <PostSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
