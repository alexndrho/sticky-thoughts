import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type IError from "@/types/error";
import { Prisma } from "@prisma/client";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ forumId: string; commentId: string }> },
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

    const { forumId, commentId } = await params;

    await prisma.forumComment.delete({
      where: {
        id: commentId,
        forumId: forumId,
      },
    });

    return NextResponse.json(
      {
        message: "Comment deleted successfully",
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
                code: "not-found",
                message: "Comment not found",
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
