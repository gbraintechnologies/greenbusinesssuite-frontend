type Props = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

/** Two-tone MeshSuite letter-M mark (teal + navy). */
export default function MeshSuiteMarkColor({
  className,
  width = 24,
  height = 24,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={width}
      height={height}
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Teal — left stem + upper \ + lower \ */}
      <path d="M4 6h8v36H4V6Z" fill="#14B8A6" />
      <path d="M14.5 6h8l6.5 14h-8L14.5 6Z" fill="#14B8A6" />
      <path d="M21 24h8l4.5 12h-8L21 24Z" fill="#14B8A6" />
      {/* Navy — right stem + upper / + lower / */}
      <path d="M36 6h8v36h-8V6Z" fill="#0C2040" />
      <path d="M25.5 6h8L27 20h-8L25.5 6Z" fill="#0C2040" />
      <path d="M19 24h8l-4.5 12h-8L19 24Z" fill="#0C2040" />
    </svg>
  );
}
