"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { forumPostOptions } from "@/lib/query-options/forum";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { NotFoundContent } from "@/app/not-found";

export default function PostPage() {
  const params = useParams<{ forumId: string }>();

  const query = useQuery(forumPostOptions(params.forumId));

  if (query.data) {
    return <Post id={query.data.id} post={query.data} />;
  } else if (query.isLoading) {
    return <PostSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
