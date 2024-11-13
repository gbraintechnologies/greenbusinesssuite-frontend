"use client";
import useAuth from "@/hooks/useAuth";
import MeshSuiteLogo from "@/public/icons/MeshSuitLogoGray";
import { useRouter } from "next/navigation";
import React from "react";
import { MdCheck } from "react-icons/md";


const verifyAccount = ({ params }: any) => {
    const tenantId = params?.tenantId;
    const router = useRouter();
    const { setAuth, removeAuth } = useAuth();

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center rounded-2xl bg-[#F8FAFC]">
            <div className="bg-[#F1F5F9] flex flex-col rounded-b-lg shadow-sm">
                <div className="bg-white rounded-md flex flex-col w-[32rem] h-[20rem] py-7 px-7">
                    <div className="flex justify-center">
                        <div className="rounded-full border border-green-100 w-20 h-20 p-2">
                            <div className="rounded-full border border-green-400 p-2 w-full h-full">
                                <div className=" bg-green-800 rounded-full p-2 w-full h-full flex justify-center items-center">
                                    <MdCheck size={20} color="white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-slate-900 text-lg text-center font-medium mt-3">
                        Account not verified!!
                    </h3>
                    <div className="mb-5">
                        <p className="text-[#475569] text-sm text-center">
                            Your account hasn't been verified successfully.
                        </p>
                        <div className="text-[#475569] text-sm text-center">
                            Click the button below to go to login.
                        </div>
                    </div>


                    <div className="mt-3 flex justify-center">
                        <button
                            className="w-64 bg-white text-black rounded-xl hover:bg-gray-100 py-2 px-4 border border-gray-300"
                            type="button"
                            onClick={() => {
                                setAuth(null);
                                removeAuth();
                                router.push(`/${tenantId}/auth/login`);
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
                <div className="text-center  text-gray-400 text-sm">
                    <div className="my-3 flex justify-center gap-2 items-center text-xs">
                        Powered by <MeshSuiteLogo />{" "}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default verifyAccount;