"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCompany() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/company-setup");
  }, [router]);

  return null;
}
