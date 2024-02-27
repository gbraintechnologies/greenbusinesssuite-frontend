// formik
import { getIn, ErrorMessage } from "formik";

// icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

export function getStyles(errors: any, fieldName: any) {
  if (getIn(errors, fieldName)) {
    return {
      border: "1px solid #FF2828",
    };
  } else {
    return {
      border: "1px solid #E1E3E4",
    };
  }
}

export function ShowError({ name }: any) {
  return (
    <ErrorMessage
      className="text-xs text-[#FF2828]"
      name={name}
      component="span"
    />
  );
}

export function PasswordToggle({ showPassword, setShowPassword }: any) {
  return (
    <span
      className="cursor-pointer absolute mt-3 top-1/3 right-4"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <AiOutlineEye size={14} className=" cursor-pointer" />
      ) : (
        <AiOutlineEyeInvisible size={14} className="cursor-pointer" />
      )}
    </span>
  );
}
