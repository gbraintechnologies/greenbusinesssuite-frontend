import Image from "next/image";

/** MeshSuite lockup for “Powered by” footers. */
const MeshSuiteLogo = () => {
  return (
    <Image
      src="/svg/mesh_logo.svg"
      alt="MeshSuite"
      width={72}
      height={24}
      className="h-5 w-auto"
      unoptimized
    />
  );
};

export default MeshSuiteLogo;
