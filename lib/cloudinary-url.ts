/**
 * Client-safe Cloudinary URL generation.
 * Does NOT import the cloudinary Node.js SDK — safe to use in Client Components.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";

export type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "limit" | "pad" | "scale" | "thumb" | "crop";
  gravity?: string;
};

// Crop modes that use gravity direction — others (limit, fit, scale, pad) ignore it
const GRAVITY_CROPS = new Set(["fill", "thumb", "crop"]);

/**
 * Build a Cloudinary delivery URL with transformation parameters.
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  // Only add gravity for crop modes that support it — c_limit, c_fit, c_scale, c_pad do NOT use gravity
  if (gravity && GRAVITY_CROPS.has(crop)) parts.push(`g_${gravity}`);
  parts.push(`q_${quality}`);
  parts.push(`f_${format}`);

  const transform = parts.join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

/**
 * Convenience: small square thumbnail.
 */
export function getCloudinaryThumbnail(publicId: string, size = 400): string {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: "thumb",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  });
}
