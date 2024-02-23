import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingIcon() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <AiOutlineLoading3Quarters className="animate-spin" />
    </div>
  );
}

export default LoadingIcon;
