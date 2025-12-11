import type { Prisma } from "@/generated/prisma/client";

export const searchSegments = [
  { label: "All", value: "all" },
  { label: "Threads", value: "threads" },
  { label: "Users", value: "users" },
] as const;

export type SearchSegmentType = (typeof searchSegments)[number]["value"];

export type SearchResultMap = {
  users: SearchUserType[];
  threads: SearchThreadType[];
  all: SearchAllType[];
};

export type SearchResult = {
  type: SearchSegmentType;
};

export type SearchUserType = Prisma.UserGetPayload<{
  select: {
    name: true;
    displayUsername: true;
    username: true;
    image: true;
  };
}> &
  SearchResult;

export type SearchThreadType = Prisma.ThreadGetPayload<{
  select: {
    id: true;
    title: true;
  };
}> &
  SearchResult;

export type SearchAllType = SearchUserType | SearchThreadType;
