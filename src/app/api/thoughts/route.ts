import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/db";
import IError from "@/types/error";
import { THOUGHTS_PER_PAGE } from "@/config/thought";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");
  const lastId = searchParams.get("lastId");

  try {
    const thoughts = await prisma.thought.findMany({
      take: THOUGHTS_PER_PAGE,
      skip: lastId ? 1 : 0,
      cursor: lastId
        ? {
            id: lastId,
          }
        : undefined,
      where: searchTerm
        ? {
            author: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(thoughts, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const { author, message, color } = await req.json();

    await prisma.thought.create({
      data: {
        author,
        message,
        color,
      },
    });

    return NextResponse.json(
      {
        message: "Thought submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError: IError = {
        errors: error.errors.map((error) => ({
          code: "validation/invalid-input",
          message: error.message,
        })),
      };

      return NextResponse.json(zodError, { status: 400 });
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
