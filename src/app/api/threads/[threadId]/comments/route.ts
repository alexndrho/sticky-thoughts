import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createThreadCommentServerInput } from "@/lib/validations/form";
import { THREAD_POST_COMMENT_PER_PAGE } from "@/config/thread";
import { formatThreadComments } from "@/utils/thread";
import type { ThreadCommentType } from "@/types/thread";
import type IError from "@/types/error";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "auth/unauthorized",
              message: "You must be logged in to like a post",
            },
          ],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { threadId } = await params;
    const { body } = createThreadCommentServerInput.parse(await request.json());

    const comment = await prisma.threadComment.create({
      data: {
        thread: {
          connect: {
            id: threadId,
          },
        },
        author: {
          connect: {
            id: session.user.id,
          },
        },
        body,
      },
      include: {
        author: {
          select: {
            id: true,
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
          },
        },
      },
    });

    const { likes, _count, ...restComment } = comment;

    const formattedPost = {
      ...restComment,
      likes: {
        liked: !!likes?.length,
        count: _count.likes,
      },
    } satisfies ThreadCommentType;

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError: IError = {
        errors: error.errors.map((err) => ({
          code: "validation/invalid-input",
          message: err.message,
        })),
      };

      return NextResponse.json(zodError, { status: 400 });
    }
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const searchParams = req.nextUrl.searchParams;
  const lastId = searchParams.get("lastId");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { threadId } = await params;

    const comments = await prisma.threadComment.findMany({
      where: {
        threadId,
      },
      include: {
        author: {
          select: {
            id: true,
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
          },
        },
      },
      take: THREAD_POST_COMMENT_PER_PAGE,
      ...(lastId && {
        cursor: {
          id: lastId,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts = formatThreadComments(comments);

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Something went wrong" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
