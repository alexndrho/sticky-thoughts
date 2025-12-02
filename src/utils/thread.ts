import type {
  BaseThreadCommentType,
  BaseThreadType,
  ThreadCommentType,
  ThreadType,
} from "@/types/thread";

export function formatThreads(threads: BaseThreadType[]): ThreadType[] {
  return threads.map((thread) => {
    const { likes, _count, ...rest } = thread;

    return {
      ...rest,
      likes: {
        liked: !!(likes && likes.length),
        count: _count.likes,
      },
      comments: {
        count: _count.comments,
      },
    } satisfies ThreadType;
  });
}

export function formatThreadComments(
  comments: BaseThreadCommentType[],
): ThreadCommentType[] {
  return comments.map((comment) => {
    const { likes, _count, ...rest } = comment;

    return {
      ...rest,
      likes: {
        liked: !!(likes && likes.length),
        count: _count.likes,
      },
    } satisfies ThreadCommentType;
  });
}
