import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type IError from "@/types/error";
import type { ThreadPostType } from "@/types/thread";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const searchParams = req.nextUrl.searchParams;
  const lastId = searchParams.get("lastId");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { username } = await params;

    const threads = await prisma.thread.findMany({
      skip: lastId ? 1 : 0,
      cursor: lastId
        ? {
            id: lastId,
          }
        : undefined,
      where: {
        likes: {
          some: {
            user: {
              username,
            },
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        likes: session
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                userId: true,
              },
            }
          : false,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedThreads: ThreadPostType[] = threads.map((thread) => {
      const { likes, _count, ...rest } = thread;

      return {
        ...rest,
        likes: {
          liked: !!likes.length,
          count: _count.likes,
        },
        comments: {
          count: _count.comments,
        },
      } satisfies ThreadPostType;
    });

    return NextResponse.json(formattedThreads);
  } catch (error) {
    console.error("Error fetching user likes:", error);

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
