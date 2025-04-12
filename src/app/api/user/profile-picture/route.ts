import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import sharp from "sharp";

import { auth } from "@/lib/auth";
import IError from "@/types/error";
import { deleteFile, isUrlStorage, uploadFile } from "@/lib/storage";
import { extractKeyFromUrl } from "@/utils/text";

export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

    if (session.user.image && isUrlStorage(session.user.image)) {
      const existingImageKey = extractKeyFromUrl(session.user.image);

      await deleteFile({
        params: {
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: existingImageKey,
        },
      });
    }

    const fileName = `user/${session.user.id}/profile/${Date.now()}.png`;

    const imageUrl = await uploadFile({
      params: {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "",
        Key: fileName,
        Body: processedImage,
        ContentType: "image/png",
        CacheControl: "no-cache",
      },
    });

    await auth.api.updateUser({
      headers: await headers(),
      body: {
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
}

export async function DELETE() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        errors: [{ code: "auth/unauthorized", message: "Unauthorized" }],
      } satisfies IError,
      { status: 401 },
    );
  }

  if (!session.user.image) {
    return NextResponse.json(
      {
        errors: [
          { code: "validation/invalid-input", message: "No image to delete" },
        ],
      } satisfies IError,
      { status: 400 },
    );
  }

  try {
    if (isUrlStorage(session.user.image)) {
      const existingImageKey = extractKeyFromUrl(session.user.image);

      await deleteFile({
        params: {
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: existingImageKey,
        },
      });
    }

    await auth.api.updateUser({
      headers: await headers(),
      body: {
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
}
