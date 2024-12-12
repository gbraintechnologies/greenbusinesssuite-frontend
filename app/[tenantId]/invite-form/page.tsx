import React from "react";

import { Metadata } from "next";

// components
import ProcessInvite from "./components/ProcessInvite";

export const metadata: Metadata = {
  title: "Mesh Suite | Form Invite",
  description: "Invitation to participate in form",
};

async function InviteToForm(props: any) {
  const params = await props.params;
  return (
    <div>
      <ProcessInvite tenantId={params.tenantId} />
    </div>
  );
}

export default InviteToForm;
