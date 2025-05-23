import { Skeleton } from "@mantine/core";

import { FORUM_POSTS_PER_PAGE } from "@/config/forum";

export function ForumPostsSkeleton() {
  return (
    <>
      {Array.from({ length: FORUM_POSTS_PER_PAGE }, (_, i) => (
        <Skeleton key={i} height={200} visible={true} />
      ))}
    </>
  );
}
