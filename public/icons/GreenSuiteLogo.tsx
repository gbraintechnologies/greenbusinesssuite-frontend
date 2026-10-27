import Image from "next/image";

type GreenSuiteLogoProps = {
  /** dark = for light backgrounds; light/white = for dark backgrounds */
  variant?: "dark" | "light" | "white";
  /** horizontal lockup vs stacked vertical vs mark-only */
  layout?: "horizontal" | "vertical" | "mark";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

const SRC = {
  mark: "/brand/gbs-mark.png",
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
  if (layout === "mark") {
    return (
      <Image
        src={SRC.mark}
        alt="Green Business Suite"
        width={width ?? 40}
        height={height ?? 40}
        className={className ?? "h-10 w-10"}
        unoptimized
        priority={priority}
      />
    );
  }

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
