"use client";

import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import DataTable from "@/components/DataTable/DataTable";
import "../index.css";
import { Countrie } from "../components/Countries";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import { deletecountryWithAssoc } from "@/services/features/jurisdictionsService";

interface RowData {
    id: number;
    name: string;
}

interface ActionMenuProps {
    row: RowData;
    onDeleteSuccess: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row, onDeleteSuccess }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const { checkPermission } = useAdmin();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleClose();
        router.push(`/country-setup/edit-jurisdiction?id=${row.id}`);
    };

    const handleDelete = async () => {
        handleClose();
        try {
            await deletecountryWithAssoc(row.id);
            onDeleteSuccess();
        } catch (error) {
            console.error("Error deleting row:", error);
        }
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <BsThreeDots size={20} />
            </IconButton>
            {checkPermission(PermissionTypes.EDIT_JURISDICTION) && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            width: 150,
                        },
                    }}
                >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>

                </Menu>
            )}
        </>
    );
};

function CountrySetup() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState<RowData[]>([]);
    const { checkPermission } = useAdmin();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(15);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["allCountries", page, limit],
        queryFn: services.allJurisdictions(page, limit),
    });

    const { data: searchData } = useQuery({
        queryKey: ["searchCountry", searchTerm], 
        queryFn: () => services.getCountryInfoByName(searchTerm),
        enabled: !!searchTerm,
    });

    useEffect(() => {
        if (searchTerm && searchData) {
            const mappedRows = [{
                id: searchData.id,
                name: searchData.countryName,
            }];
            setRows(mappedRows);
        } else if (data?.countries) {
            const mappedRows = data.countries.map((country: any) => ({
                id: country.id,
                name: country.countryName,
            }));
            setRows(mappedRows);
        }
    }, [searchData, data, searchTerm]);
    
    
    useEffect(() => {
        refetch();
    }, [page, limit, refetch]);

    const handleDeleteSuccess = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error("Error fetching updated data:", error);
        }
    };

    const columns = [
        {
            field: "country",
            headerName: "Country",
            type: "actions",
            align: "left",
            headerAlign: "left",
            flex: 3,
            getActions: (params: any) => [
                <div className="flex py-3 gap-4 my-3 items-center" key={params.row.id}>
                    <label>
                        <input
                            type="checkbox"
                            className="mr-4 styled-checkbox flex items-center justify-center"
                        />
                    </label>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="">
                            <img
                                src={Countrie(params.row.name)?.flags.png}
                                alt={Countrie(params.row.name)?.name.common}
                                style={{ height: "auto", width: "30px" }}
                            />
                        </span>
                    </div>
                    <div>
                        <p className="font-medium">{params.row.name}</p>
                    </div>
                </div>,
            ],
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            type: "actions",
            renderCell: (params: any) => (
                <ActionMenu row={params.row} onDeleteSuccess={handleDeleteSuccess} />
            ),
        },
    ];

    return (
        <div className="w-full pb-20">
            <Nav />
            <div className="flex items-center px-5 justify-between my-4">
                {checkPermission(PermissionTypes.SEARCH_JURISDICTION) && (
                    <div className="flex items-center gap-3">
                        <div className="border shadow-sm border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
                            <SearchIcon />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="outline-none text-sm focus:outline-none bg-white input-custom"
                                placeholder="Search by Country"
                            />
                        </div>
                    </div>
                )}
            </div>
            <DataTable
                isLoading={isLoading}
                rows={rows} // Pass the mapped rows to the DataTable
                columns={columns}
            />
            <div className="w-full flex justify-between">
                <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
                <Pagination
                    currentData={data}
                    limit={limit}
                    page={page}
                    setPage={setPage}
                />
            </div>
        </div>
    );
}

export default CountrySetup;
