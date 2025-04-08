import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import sharp from "sharp";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFromR2, uploadBufferToR2 } from "@/lib/r2";
import IError from "@/types/error";

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
    const formData = await req.formData();
    const userImg = formData.get("user-image");

    if (!(userImg instanceof File)) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "validation/invalid-input",
              message: "Invalid or missing file",
            },
          ],
        } satisfies IError,
        { status: 400 },
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(userImg.type)) {
      return NextResponse.json(
        {
          errors: [
            { code: "validation/invalid-input", message: "Invalid file type" },
          ],
        } satisfies IError,
        { status: 400 },
      );
    }

    if (userImg.size > maxSize) {
      return NextResponse.json(
        {
          errors: [
            {
              code: "validation/too-large",
              message: "File size exceeds limit",
            },
          ],
        } satisfies IError,
        { status: 400 },
      );
    }

    const arrayBuffer = await userImg.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const processedImage = await sharp(buffer)
      .resize(256, 256)
      .png({
        quality: 80,
      })
      .toBuffer();

    const fileName = `profile/${session.user.id}/profile-picture.png`;

    const imageUrl = await uploadBufferToR2({
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "",
        Key: fileName,
        Body: processedImage,
        ContentType: "image/png",
        CacheControl: "no-cache",
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    });

    return NextResponse.json(
      {
        image: imageUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2015") {
        return NextResponse.json(
          {
            errors: [{ code: "not-found", message: "User not found" }],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "An error occurred" }],
      } satisfies IError,
      { status: 500 },
    );
  }
});

export const DELETE = auth(async (req) => {
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
    await deleteFromR2({
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "",
        Key: `profile/${session.user.id}/profile-picture.png`,
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: null,
      },
    });

    return NextResponse.json(
      {
        image: null,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2015") {
        return NextResponse.json(
          {
            errors: [{ code: "not-found", message: "User not found" }],
          } satisfies IError,
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        errors: [{ code: "unknown-error", message: "An error occurred" }],
      } satisfies IError,
      { status: 500 },
    );
  }
});
