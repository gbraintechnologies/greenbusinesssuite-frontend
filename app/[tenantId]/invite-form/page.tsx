import React from "react";

import { Metadata } from "next";

// components
import ProcessInvite from "./components/ProcessInvite";

export const metadata: Metadata = {
  title: "Mesh Suite | Form Invite",
  description: "Invitation to participate in form",
};

function InviteToForm({ params }: any) {
  return (
    <div>
      <ProcessInvite tenantId={params.tenantId} />
    </div>
  );
}

export default InviteToForm;
