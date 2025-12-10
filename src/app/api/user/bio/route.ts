import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import IError from "@/types/error";
import { updateUserBioInput } from "@/lib/validations/user";
import z from "zod";

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          issues: [{ code: "auth/unauthorized", message: "Unauthorized" }],
        } satisfies IError,
        { status: 401 },
      );
    }

    const { bio } = updateUserBioInput.parse(await request.json());

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio,
      },
    });

    return NextResponse.json(
      {
        message: "User bio updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError: IError = {
        issues: error.issues.map((issue) => ({
          code: "validation/invalid-input",
          message: issue.message,
        })),
      };
      return NextResponse.json(zodError, { status: 400 });
    }

    console.error("Error updating user bio:", error);
    return NextResponse.json(
      {
        issues: [{ code: "unknown-error", message: "Unknown error" }],
      } satisfies IError,
      { status: 500 },
    );
  }
}
