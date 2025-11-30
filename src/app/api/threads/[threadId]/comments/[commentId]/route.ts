import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateThreadCommentServerInput } from "@/lib/validations/form";
import type IError from "@/types/error";

export async function PUT(
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

    const { threadId, commentId } = await params;
    const { body } = updateThreadCommentServerInput.parse(await request.json());

    const updatedComment = await prisma.threadComment.update({
      where: {
        id: commentId,
        threadId,
      },
      data: {
        body,
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
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

    const { threadId, commentId } = await params;

    await prisma.threadComment.delete({
      where: {
        id: commentId,
        threadId,
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
