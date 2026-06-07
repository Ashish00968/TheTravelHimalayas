"use client";

import Image, { ImageProps } from "next/image";
import { buildCloudinaryUrl, CloudinaryTransform } from "@/lib/cloudinary";

const FALLBACK_IMAGE = "/images/placeholder-mountain.jpg";

interface CloudinaryImageProps extends Omit<ImageProps, "src"> {
  src: string;
  transforms?: CloudinaryTransform;
}

export function CloudinaryImage({
  src,
  transforms,
  alt,
  ...props
}: CloudinaryImageProps) {
  const url = buildCloudinaryUrl(src || FALLBACK_IMAGE, transforms);

  return (
    <Image
      src={url}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
      loading={props.priority ? undefined : "lazy"}
      {...props}
    />
  );
}
