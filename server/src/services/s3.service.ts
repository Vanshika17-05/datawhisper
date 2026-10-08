import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env.js";

const s3 = new S3Client({ region: env.AWS_REGION });
const SIGNED_URL_TTL_SECONDS = 15 * 60;
const PROFILE_PHOTO_TTL_SECONDS = 7 * 24 * 60 * 60;

export function logS3ClientReady(): void {
  console.log(`S3 client ready: ${env.AWS_S3_BUCKET_NAME}`);
}

export type ExportFormat = "png" | "csv";

export async function uploadExport(userId: string, queryHistoryId: string, format: ExportFormat, body: Buffer): Promise<string> {
  const key = `exports/${userId}/${queryHistoryId}.${format}`;
  await s3.send(new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: format === "png" ? "image/png" : "text/csv; charset=utf-8",
    ServerSideEncryption: "AES256",
  }));
  return key;
}

export function getExportDownloadUrl(key: string, queryHistoryId: string, format: ExportFormat): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="datawhisper-${queryHistoryId}.${format}"`,
  });
  return getSignedUrl(s3, command, { expiresIn: SIGNED_URL_TTL_SECONDS });
}

export async function uploadProfilePhoto(userId: string, extension: string, contentType: string, body: Buffer): Promise<string> {
  const key = `profile-photos/${userId}.${extension}`;
  await s3.send(new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "private, max-age=3600",
    ServerSideEncryption: "AES256",
  }));
  return key;
}

export function getProfilePhotoUrl(key: string): Promise<string> {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET_NAME, Key: key }), { expiresIn: PROFILE_PHOTO_TTL_SECONDS });
}

export async function deleteProfilePhoto(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: env.AWS_S3_BUCKET_NAME, Key: key }));
}
