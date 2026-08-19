import Image from "next/image";

/** Green Business Suite lockup for "Powered by" footers. */
const MeshSuiteLogo = () => {
  return (
    <Image
      src="/svg/mesh_logo.svg"
      alt="Green Business Suite"
      width={72}
      height={24}
      className="h-5 w-auto"
      unoptimized
    />
  );
};

export default MeshSuiteLogo;
