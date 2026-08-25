import GreenSuiteLogo from "@/public/icons/GreenSuiteLogo";

/** Compact lockup for “Powered by” footers on light backgrounds. */
const MeshSuiteLogo = () => {
  return (
    <GreenSuiteLogo
      variant="dark"
      layout="horizontal"
      width={150}
      height={50}
      className="h-7 w-auto"
    />
  );
};

export default MeshSuiteLogo;
