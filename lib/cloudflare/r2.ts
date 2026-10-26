import "server-only";

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const bucketName = process.env.R2_BUCKET_NAME;

if (
  !accountId ||
  !bucketName ||
  !process.env.R2_ACCESS_KEY_ID ||
  !process.env.R2_SECRET_ACCESS_KEY
) {
  throw new Error("Cloudflare R2 environment variables are missing.");
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.eu.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Stops the SDK adding a CRC32 checksum of an empty body to presigned URLs,
  // which makes R2 reject the real upload.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function createUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: "image/webp",
  });

  return getSignedUrl(r2, command, { expiresIn: 300 });
}

export async function getObjectMetadata(key: string) {
  return r2.send(
    new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

export async function deleteR2Object(key: string) {
  return r2.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

export function getPublicImageUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("R2_PUBLIC_BASE_URL is not configured.");
  }

  const encodedKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${baseUrl.replace(/\/$/, "")}/${encodedKey}`;
}