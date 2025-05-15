"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getForumPost } from "@/services/forum";
import PostContent from "./PostContent";
import PostSkeleton from "./PostSkeleton";
import { NotFoundContent } from "@/app/not-found";

export default function PostPage() {
  const params = useParams<{ id: string }>();

  const query = useQuery({
    queryKey: ["forum", params.id],
    queryFn: () => getForumPost(params.id),
  });

  if (query.data) {
    return <PostContent id={query.data.id} post={query.data} />;
  } else if (query.isLoading) {
    return <PostSkeleton />;
  } else {
    return <NotFoundContent />;
  }
}
