import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type IError from "@/types/error";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string; commentId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          issues: [
            {
              code: "auth/unauthorized",
              message: "You must be logged in to like a post",
            },
          ],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { threadId, commentId } = await params;

    await prisma.threadCommentLike.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        comment: {
          connect: {
            id: commentId,
            threadId: threadId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment liked successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            issues: [
              {
                code: "validation/unique-constraint",
                message: "You have already liked this comment",
              },
            ],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    console.error(error);
    return NextResponse.json(
      {
        issues: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,

  { params }: { params: Promise<{ threadId: string; commentId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          issues: [
            {
              code: "auth/unauthorized",
              message: "You must be logged in to like a post",
            },
          ],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { threadId, commentId } = await params;

    await prisma.threadCommentLike.delete({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
        AND: {
          comment: {
            threadId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment unliked successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            issues: [
              {
                code: "validation/unique-constraint",
                message: "You have not liked this comment",
              },
            ],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    console.error(error);
    return NextResponse.json(
      {
        issues: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
