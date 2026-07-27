type Props = {
  className?: string;
  /** Fill for the icon paths — use white on purple bars */
  color?: string;
};

/**
 * MeshSuite letter-M mark — interlocking mesh diagonals.
 * Monochrome; pass `color` for light/dark surfaces.
 */
export default function MeshSuiteMark({
  className = "h-5 w-5",
  color = "currentColor",
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      <path d="M4 6h8v36H4V6Z" fill={color} />
      <path d="M36 6h8v36h-8V6Z" fill={color} />
      <path d="M14.5 6h8l6.5 14h-8L14.5 6Z" fill={color} />
      <path d="M25.5 6h8L27 20h-8L25.5 6Z" fill={color} />
      <path d="M19 24h8l-4.5 12h-8L19 24Z" fill={color} />
      <path d="M21 24h8l4.5 12h-8L21 24Z" fill={color} />
    </svg>
  );
}
