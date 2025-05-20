import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import IError from "@/types/error";
import { updateForumServerInput } from "@/lib/validations/form";
import type { ForumPostType } from "@/types/forum";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ forumId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { forumId } = await params;

    const forum = await prisma.forum.findUnique({
      where: {
        id: forumId,
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
          },
        },
      },
    });

    if (!forum) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "not-found",
              message: "Forum post not found",
            },
          ],
        } satisfies IError,
        {
          status: 404,
        },
      );
    }

    const { likes, _count, ...restForum } = forum;

    const formattedPost: ForumPostType = {
      ...restForum,
      likes: {
        liked: !!likes?.length,
        count: _count.likes,
      },
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}

export async function PUT(
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
          errors: [{ code: "auth/unauthorized", message: "Unauthorized" }],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { forumId } = await params;

    const { body } = updateForumServerInput.parse(await request.json());

    const updatedForum = await prisma.forum.update({
      where: {
        id: forumId,
        authorId: session.user.id,
      },
      data: {
        body,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedForum);
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError: IError = {
        errors: error.errors.map((error) => ({
          code: "validation/invalid-input",
          message: error.message,
        })),
      };

      return NextResponse.json(zodError, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2015") {
        return NextResponse.json(
          {
            errors: [
              {
                code: "not-found",
                message: "Box not found",
              },
            ],
          } satisfies IError,
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}

export async function DELETE(
  requst: Request,
  { params }: { params: Promise<{ forumId: string }> },
) {
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

    const { forumId } = await params;

    await prisma.forum.delete({
      where: {
        id: forumId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Forum post deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2015") {
        return NextResponse.json(
          {
            errors: [
              {
                code: "not-found",
                message: "Box not found",
              },
            ],
          } satisfies IError,
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
