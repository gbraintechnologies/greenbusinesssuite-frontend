"use client"
import { useSearchParams } from "next/navigation";
import React from "react"

const Page = () => {
    const searchParams = useSearchParams();

    const id = searchParams.get("id");
    return (
        <div className="px-5 pb-20">This is the page response</div>
    )
}

export default Page