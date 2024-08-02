import React, { ComponentProps } from "react";
import { Button } from "@nextui-org/button";
import useCompany from "@/hooks/useCompany";

type Props = ComponentProps<typeof Button>;

export default function CompanyThemedButton(props: Props) {
  const { companyBranding: company } = useCompany();
  return (
    <Button
      size="md"
      radius="sm"
      {...props}
      style={{ backgroundColor: company?.color }}
      className={`disabled:bg-gray-400 py-2 flex text-white text-sm px-4 hover:opacity-95 items-center gap-2 rounded-xl ${props.className}`}
    >
      {props.children}
    </Button>
  );
}
