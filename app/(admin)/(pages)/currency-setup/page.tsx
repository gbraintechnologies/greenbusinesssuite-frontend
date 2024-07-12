"use client";

import React, { useEffect, useState } from "react";
//import Nav from "./components/Nav";

// services
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import DataTable from "@/components/DataTable/DataTable";
import { useRouter } from "next/navigation";
import { deleteCurrencyByID } from "@/services/features/currencyService";
import "./index.css";
import Nav from "./components/Nav";
import { Countrieses } from "./components/Countries";


interface Currency {
  id: number;
  currency: string;
  symbol: string;
  countryName: string;
}

interface ActionMenuProps {
  row: Currency;
  onDeleteSuccess: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row, onDeleteSuccess }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleEdit = () => {
  //   handleClose();
  //   //alert(JSON.stringify(row.id))
  //   router.push(`/country-setup/edit-jurisdiction?id=${row.id}`);
  // };

  const handleDelete = async () => {
    handleClose();
    try {
      await deleteCurrencyByID(row.id);
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
        {/* <MenuItem onClick={handleEdit}>Edit</MenuItem> */}
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};


function CurrencySetup() {
  const [rows, setRows] = useState<Currency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // fetch all currencies
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all currencies"],
    queryFn: services.allCurrencies(),
  });

  useEffect(() => {
    // alert(JSON.stringify(data))
    if (data) {
      setRows(data);
    }
  }, [data]);

  const handleDeleteSuccess = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  const columns = [
    {
      field: "currency",
      headerName: "Currency",
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
                src={Countrieses(params.row.countryName)?.flags.png}
                alt={Countrieses(params.row.countryName)?.name.common}
                style={{ height: "auto", width: "30px" }}
              />
            </span>
          </div>
          <div>
            <p className="font-medium">{params.row.currency}</p>
          </div>
        </div>,
      ],
    },
    {
      field: "symbols",
      headerName: "Symbols",
      flex: 1,
      headerAlign: "left",
      align: "middle",
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">{params.row.symbol}</p>
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

  const filteredRows = rows.filter(
    (row) =>
      row.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full pb-20 ">
      <Nav />

      {/* Search and filters */}
      <div className="flex items-center px-5 justify-between my-4">
        <div className="flex items-center gap-3">
          <div className="border shadow-sm  border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white input-custom"
              placeholder="Search by Currency"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable isLoading={isLoading} rows={filteredRows} columns={columns} />
    </div>
  );
}

export default CurrencySetup;
