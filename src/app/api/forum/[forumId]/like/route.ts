import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import IError from "@/types/error";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

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

    await prisma.forumLike.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        forum: {
          connect: {
            id: forumId,
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
            errors: [
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
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}

export async function DELETE(
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
              message: "You must be logged in to unlike a post",
            },
          ],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { forumId } = await params;

    await prisma.forumLike.delete({
      where: {
        userId_forumId: {
          userId: session.user.id,
          forumId,
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
            errors: [
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
        errors: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
