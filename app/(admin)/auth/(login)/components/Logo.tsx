import React from "react";
import Image from "next/image";

interface Logo {
  src: string;
  width?: number;
  height?: number;
  className?: string;
}
export default function Logo({ src, width, height, className }: Logo) {
  return (
    <Image
      width={width ?? 100}
      height={height ?? 100}
      alt="mesh_icon"
      src={src}
      className={className}
    />
  );
}
