import Image from "next/image";

type GreenSuiteLogoProps = {
  /** dark = for light backgrounds; light/white = for dark backgrounds */
  variant?: "dark" | "light" | "white";
  /** horizontal lockup vs stacked vertical */
  layout?: "horizontal" | "vertical";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

const SRC = {
  horizontal: {
    dark: "/brand/greensuite_logo_on_light.png",
    light: "/brand/greensuite_logo_light.png",
    white: "/brand/greensuite_logo_white.png",
  },
  vertical: {
    dark: "/brand/greensuite_logo_v_dark.png",
    light: "/brand/greensuite_logo_v_light.png",
    white: "/brand/greensuite_logo_v_white.png",
  },
} as const;

/** Green Business Suite brand lockup (cropped, transparent background). */
export default function GreenSuiteLogo({
  variant = "dark",
  layout = "horizontal",
  width,
  height,
  className,
  priority = false,
}: GreenSuiteLogoProps) {
  const src =
    layout === "vertical" ? SRC.vertical[variant] : SRC.horizontal[variant];

  const defaults =
    layout === "vertical"
      ? { width: 120, height: 117, className: "h-16 w-auto" }
      : { width: 180, height: 60, className: "h-8 w-auto" };

  return (
    <Image
      src={src}
      alt="Green Business Suite"
      width={width ?? defaults.width}
      height={height ?? defaults.height}
      className={className ?? defaults.className}
      unoptimized
      priority={priority}
    />
  );
}
