// SERVER ONLY — this file imports the cloudinary Node.js SDK which uses 'fs'.
// For URL generation in client components, use @/lib/cloudinary-url instead.

import { v2 as cloudinary } from "cloudinary";

// Configure once — server-side only
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Re-export client-safe URL helpers for convenience in server components
export {
  getCloudinaryUrl,
  getCloudinaryThumbnail,
  type CloudinaryTransformOptions,
} from "./cloudinary-url";

// ── Upload ───────────────────────────────────────────────────

export type UploadResult = {
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  secure_url: string;
};

/**
 * Upload a file buffer or base64 string to Cloudinary.
 * SERVER ONLY — uses API secret.
 */
export async function uploadToCloudinary(
  file: string,
  folder = "balaphoto"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    overwrite: false,
  });

  return {
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    secure_url: result.secure_url,
  };
}

// ── Delete ───────────────────────────────────────────────────

/**
 * Delete an image from Cloudinary by its public_id.
 * SERVER ONLY — uses API secret.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary delete failed: ${result.result}`);
  }
}

export { cloudinary };
