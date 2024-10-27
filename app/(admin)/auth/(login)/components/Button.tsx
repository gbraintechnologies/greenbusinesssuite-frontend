import clsx from "clsx";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary" | "white" | "slate";
  size?: "normal" | "small";
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  isValid?: boolean;
}

const Button: React.FC<IButton> = ({
  children,
  isLoading,
  variant = "filled",
  color = "primary",
  size = "normal",
  loadingText = "Loading...",
  type = "button",
  className,
  isValid,
  ...rest
}) => (
  <button
    type={type}
    {...rest}
    className={clsx(
      "disabled:bg-green-500 whitespace-nowrap rounded-md disabled:cursor-not-allowed flex items-center justify-center",
      color === "primary" && {
        "bg-green-500 text-white": variant === "filled",
        "text-white": variant === "outlined",
      },
      color === "secondary" && {
        "bg-slate-600 text-white": variant === "filled",
        "border border-slate-600 text-white": variant === "outlined",
      },
      color === "slate" && {
        "bg-slate-100 font-medium text-slate-700": variant === "filled",
        "text-slate-700 font-medium border border-slate-600":
          variant === "outlined",
      },
      color === "white" && {
        "bg-white border border-slate-200 text-slate-700": variant === "filled",
        "border border-slate-600 text-slate-700": variant === "outlined",
      },
      size === "normal" ? "p-4 h-[42px]" : "px-4 h-[40px]",
      isValid ? "bg-green-500" : "bg-zinc-300",
      className
    )}
  >
    {isLoading ? (
      <div className="flex items-center justify-center gap-x-3">
        <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
        <span>{loadingText}</span>
      </div>
    ) : (
      children
    )}
  </button>
);
export default Button;
