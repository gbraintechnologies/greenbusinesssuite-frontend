import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

//
import "./index.css";

export function PhoneSelector({ setPhone, phone }: any) {
  return (
    <PhoneInput
      defaultCountry="gh"
      value={phone}
      onChange={(phone: any) => setPhone(phone)}
    />
  );
}
