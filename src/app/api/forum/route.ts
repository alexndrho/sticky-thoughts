import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { FORUM_POSTS_PER_PAGE } from "@/config/post";
import { createForumServerInput } from "@/lib/validations/form";
import type IError from "@/types/error";
import { ForumPostType } from "@/types/forum";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          errors: [{ code: "auth/unauthorized", message: "Unauthorized" }],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { title, body } = createForumServerInput.parse(await req.json());

    const post = await prisma.forum.create({
      data: {
        title,
        body,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json({
      id: post.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError: IError = {
        errors: error.errors.map((err) => ({
          code: "validation/invalid-input",
          message: err.message,
        })),
      };

      return NextResponse.json(zodError, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            errors: [
              {
                code: "forum/title-already-exists",
                message: "Post name must be unique",
              },
            ],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Something went wrong" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");
  const lastId = searchParams.get("lastId");

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const forums = await prisma.forum.findMany({
      take: FORUM_POSTS_PER_PAGE,
      skip: lastId ? 1 : 0,
      cursor: lastId
        ? {
            id: lastId,
          }
        : undefined,
      where: searchTerm
        ? {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : undefined,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts: ForumPostType[] = forums.map((post) => {
      const { likes, _count, ...restForums } = post;

      return {
        ...restForums,
        likes: {
          liked: !!likes?.length,
          count: _count.likes,
        },
      } satisfies ForumPostType;
    });

    return NextResponse.json(formattedPosts, { status: 200 });
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
