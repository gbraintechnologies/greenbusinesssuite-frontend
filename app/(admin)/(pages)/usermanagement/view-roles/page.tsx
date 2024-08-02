"use client";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import services from "@/services";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import DeleteIcon from "@/public/icons/DeleteIcon";
import EditIconSetup from "@/public/icons/EditIconSetup";
import { useRouter } from "next/navigation";


interface FlattenedRowData {
    id: number;
    rowId: number;
    countryId: number;
    countryName: string;
    parentSectorCount: number;
    subSectorCount: number;
}
function ViewRoles() {
    const router = useRouter();
    const [rows, setRows] = useState<FlattenedRowData[]>([]);


    const columns = [
        {
            field: "name of role",
            headerName: "Name of Role",
            flex: 1,
            renderCell: (params: any) => (
                <div className="flex py-3 gap-4 my-3 items-center">
                    <div className="h-10 flex items-center justify-center">
                        {params.value}
                    </div>
                </div>
            ),
        },
        {
            field: "Role description",
            headerName: "Role Description",
            flex: 3,
            renderCell: (params: any) => (
                <div
                    className="flex flex-col gap-2 my-2"
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                    <p className="font-medium text-sm">{params.value}</p>
                </div>
            ),
        },
        {
            field: "Permissions",
            headerName: "Permissions",
            flex: 3,
            renderCell: (params: any) => (
                <div
                    className="flex flex-col gap-2 my-2"
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                    <p className="font-medium text-sm">{params.value}</p>
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params: any) => (
                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        className="rounded-full "
                        style={{ right: "-10px" }}
                    >
                        <EditIconSetup />
                    </button>
                    <button
                        type="button"
                        className="rounded-full"
                        style={{ right: "-10px" }}
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full p-5">
            <div className="w-full">

                <div className="w-full text-primary-dark flex justify-between">
                    <div>
                        <h3 className="font-semibold text-xl">View all roles</h3>
                    </div>
                    <div className="flex gap-3 items-center justify-end">
                        <Link href="/usermanagement/new-role">
                            <button
                                type="button"
                                className="button bg-primary-green border border-gray-200 shadow-sm py-3 px-4 flex text-white text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                            >
                                <IoIosAddCircleOutline />Add new Roles
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="w-full mt-10">
                <DataTable rows={rows} columns={columns} />
            </div>
        </div>
    );
}

export default ViewRoles;
