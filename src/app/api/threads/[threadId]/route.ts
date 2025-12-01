import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ZodError } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import IError from "@/types/error";
import { updateThreadServerInput } from "@/lib/validations/form";
import type { ThreadType } from "@/types/thread";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { threadId } = await params;

    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
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
    });

    if (!thread) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "not-found",
              message: "Thread post not found",
            },
          ],
        } satisfies IError,
        {
          status: 404,
        },
      );
    }

    const { likes, _count, ...restThread } = thread;

    const formattedPost: ThreadType = {
      ...restThread,
      likes: {
        liked: !!likes?.length,
        count: _count.likes,
      },
      comments: {
        count: _count.comments,
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
  { params }: { params: Promise<{ threadId: string }> },
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

    const { threadId } = await params;

    const { body } = updateThreadServerInput.parse(await request.json());

    const updatedThread = await prisma.thread.update({
      where: {
        id: threadId,
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

    return NextResponse.json(updatedThread);
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
                message: "Thread post not found",
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
  { params }: { params: Promise<{ threadId: string }> },
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

    const { threadId } = await params;

    await prisma.thread.delete({
      where: {
        id: threadId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Thread post deleted",
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
                message: "Thread post not found",
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
