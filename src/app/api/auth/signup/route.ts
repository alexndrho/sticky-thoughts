import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { ZodError } from "zod";
import type IError from "@/types/error";
import type { authCode } from "@/types/error";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenedErrors = error.flatten();
      const combinedErrors: IError["errors"] = [
        ...flattenedErrors.formErrors.map((message) => ({
          code: "auth/invalid-input" as authCode,
          message,
        })),
        ...(flattenedErrors.fieldErrors.username ?? []).map((message) => ({
          code: "auth/invalid-username" as authCode,
          message,
        })),
        ...(flattenedErrors.fieldErrors.email ?? []).map((message) => ({
          code: "auth/invalid-email" as authCode,
          message,
        })),
        ...(flattenedErrors.fieldErrors.password ?? []).map((message) => ({
          code: "auth/invalid-password" as authCode,
          message,
        })),
      ];

      return NextResponse.json(
        {
          errors: combinedErrors,
        } satisfies IError,
        { status: 422 },
      );
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            errors: [
              {
                code: "auth/invalid-username",
                message: "Username already exists",
              },
            ],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [
          {
            code: "unknown-error",
            message: "Something went wrong",
          },
        ],
      } satisfies IError,
      { status: 500 },
    );
  }
}
