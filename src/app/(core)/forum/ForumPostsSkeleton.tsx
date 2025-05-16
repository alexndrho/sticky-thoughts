import { Skeleton } from "@mantine/core";

export function ForumPostsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} height={200} radius="lg" visible={true} />
      ))}
    </>
  );
}
