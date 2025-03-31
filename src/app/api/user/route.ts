import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateUserInput } from "@/lib/validations/user";
import type IError from "@/types/error";

export const GET = auth(async (req) => {
  const session = req.auth;

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        errors: [{ code: "auth/unauthorized", message: "Unauthorized" }],
      } satisfies IError,
      { status: 401 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          errors: [{ code: "not-found", message: "User not found" }],
        } satisfies IError,
        { status: 404 },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "Something went wrong" }],
      } satisfies IError,
      { status: 500 },
    );
  }
});

export const PUT = auth(async (req) => {
  const session = req.auth;

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        errors: [{ code: "auth/unauthorized", message: "Unauthorized" }],
      } satisfies IError,
      { status: 401 },
    );
  }

  try {
    const { name, username } = updateUserInput.parse(await req.json());

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        username,
      },
    });

    return NextResponse.json(
      {
        message: "Username updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const ZodError: IError = {
        errors: error.errors.map((err) => ({
          code: "validation/invalid-input",
          message: err.message,
        })),
      };

      return NextResponse.json(ZodError, { status: 422 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            errors: [
              {
                code: "database/unique-constraint",
                message: "Username already taken",
              },
            ],
          } satisfies IError,
          { status: 409 },
        );
      } else if (error.code === "2015" || error.code === "P2025") {
        return NextResponse.json(
          {
            errors: [{ code: "not-found", message: "User not found" }],
          } satisfies IError,
          { status: 404 },
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
});
