import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

//
import "./index.css";

export function PhoneSelector({ setPhone, phone, disabled = false, hideDropdown=false, display="block" }: any) {
  return (
    <PhoneInput
      defaultCountry="gh"
      value={phone}
      onChange={setPhone ? (phone: any) => setPhone(phone) : undefined}
      disabled={disabled}
      hideDropdown={hideDropdown}
      countrySelectorStyleProps={{
        style: {
          display: display,
        }
      }}
    />
  );
}
