import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import IError from "@/types/error";

export async function GET() {
  try {
    const count = await prisma.thought.count();

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error(error);

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
