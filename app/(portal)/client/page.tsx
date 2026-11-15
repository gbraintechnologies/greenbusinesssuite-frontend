"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/** /client → dashboard */
export default function ClientPortalRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/client/dashboard");
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <AiOutlineLoading3Quarters
        size={22}
        className="animate-spin text-brand-600"
      />
    </div>
  );
}
