import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.CLOUDFLARE_R2_BUCKET_REGION,
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY || "",
  },
});

export const uploadBufferToR2 = async ({
  params,
}: {
  params: PutObjectCommandInput;
}) => {
  if (!params.Body || !(params.Body instanceof Buffer)) {
    throw new Error("Invalid file object");
  }

  if (!process.env.CLOUDFLARE_R2_ENDPOINT_ACCESS) {
    throw new Error("CLOUDFLARE_R2_ENDPOINT_ACCESS is not defined");
  }

  await s3Client.send(new PutObjectCommand(params));
  return process.env.CLOUDFLARE_R2_ENDPOINT_ACCESS + "/" + params.Key;
};

export const deleteFromR2 = async ({
  params,
}: {
  params: DeleteObjectCommandInput;
}) => {
  if (!process.env.CLOUDFLARE_R2_ENDPOINT_ACCESS) {
    throw new Error("CLOUDFLARE_R2_ENDPOINT_ACCESS is not defined");
  }

  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: params.Bucket,
      Key: params.Key,
    }),
  );
};
