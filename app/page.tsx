"use client";

import React, { useEffect } from "react";

import { redirect } from "next/navigation";

function Intro() {
  useEffect(() => {
    redirect("/auth/login");
  }, []);

  return <div></div>;
}

export default Intro;
