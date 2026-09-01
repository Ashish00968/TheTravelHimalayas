"use client";

import Image, { ImageProps } from "next/image";

interface CloudinaryImageProps extends Omit<ImageProps, "src"> {
  src?: string;
  transforms?: Record<string, unknown>;
}

export function CloudinaryImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: CloudinaryImageProps) {
  if (!src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 flex items-center justify-center ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Himalayan landscape"}
      sizes={sizes}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
      loading={props.priority ? undefined : "lazy"}
      className={`transform-gpu ${className}`}
      {...props}
    />
  );
}
