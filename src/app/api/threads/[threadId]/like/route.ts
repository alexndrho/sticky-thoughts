import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import IError from "@/types/error";

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

    const { threadId } = await params;

    await prisma.threadLike.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        thread: {
          connect: {
            id: threadId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Post liked successfully",
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
                message: "You have already liked this post",
              },
            ],
          } satisfies IError,
          { status: 409 },
        );
      }
    }

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
  { params }: { params: Promise<{ threadId: string }> },
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
              message: "You must be logged in to unlike a post",
            },
          ],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { threadId } = await params;

    await prisma.threadLike.delete({
      where: {
        userId_threadId: {
          userId: session.user.id,
          threadId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Post unliked successfully",
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
                message: "You have not liked this post yet",
              },
            ],
          } satisfies IError,
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        issues: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
