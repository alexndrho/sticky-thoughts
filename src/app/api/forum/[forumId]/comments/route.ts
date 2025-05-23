import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createForumCommentInput } from "@/lib/validations/form";
import { FORUM_POST_COMMENT_PER_PAGE } from "@/config/forum";
import type { ForumPostCommentType } from "@/types/forum";
import type IError from "@/types/error";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ forumId: string }> },
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

    const { forumId } = await params;
    const { body } = createForumCommentInput.parse(await request.json());

    const comment = await prisma.forumComment.create({
      data: {
        forum: {
          connect: {
            id: forumId,
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
    } satisfies ForumPostCommentType;

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
  { params }: { params: Promise<{ forumId: string }> },
) {
  const searchParams = req.nextUrl.searchParams;
  const lastId = searchParams.get("lastId");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { forumId } = await params;

    const comments = await prisma.forumComment.findMany({
      where: {
        forumId,
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
      take: FORUM_POST_COMMENT_PER_PAGE,
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

    const formattedPosts: ForumPostCommentType[] = comments.map((comment) => {
      const { likes, _count, ...restComment } = comment;

      return {
        ...restComment,
        likes: {
          liked: !!likes?.length,
          count: _count.likes,
        },
      } satisfies ForumPostCommentType;
    });

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
