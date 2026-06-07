// src/lib/cloudinary.ts

export interface CloudinaryTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif";
  crop?: "fill" | "fit" | "scale";
}

/**
 * Builds a Cloudinary URL with transformation parameters.
 * In this phase, returns the src unchanged (placeholder images).
 * When Cloudinary is integrated, this will construct proper transform URLs.
 */
export function buildCloudinaryUrl(
  src: string,
  transforms: CloudinaryTransform = {}
): string {
  // In this phase, return the src unchanged (placeholder images).
  // Future: construct Cloudinary transformation URL from params.
  return src;
}
