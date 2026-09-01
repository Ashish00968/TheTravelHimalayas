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
 * In this phase, returns the src unchanged.
 */
export function buildCloudinaryUrl(
  src: string,
  transforms?: CloudinaryTransform
): string {
  if (transforms) {
    return src;
  }
  return src;
}
