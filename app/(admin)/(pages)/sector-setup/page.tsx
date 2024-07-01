"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import Nav from "./components/Nav";
import { deleteSectorByID } from "@/services/features/sectorService";

interface SectorID {
  id: number;
  // Add other properties relevant to your data
}

interface RowData {
  id: number;
  data: SectorID;
}

interface ActionMenuProps {
  row: RowData;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    console.log('Edit:', row);
    // Add your edit logic here
  };

  const handleDelete = () => {
    handleClose();
    console.log('Delete:', row);
    // Add your delete logic here
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
            width: 150
          }
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const SectorSetup: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rows, setRows] = useState<RowData[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["all sectors"],
    queryFn: services.getSectorByCountry("Ghana"),
  });

  useEffect(() => {
    if (data) {
      // alert(JSON.stringify(data))
      const formattedRows = data.map((item: any, index: any) => ({
        id: index + 1,
        sectors: item.sectors,
        subSector: item.subSector,
      }));
      setRows(formattedRows);
    }
  }, [data]);



  const columns = [
    {
      field: "sector",
      headerName: "Sectors",
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
          <div>
            <p className="font-medium">
              {params.row.sectors}
            </p>
          </div>
        </div>,
      ],
    },
    {
      field: "Sub Sectors",
      headerName: "Sub Sectors",
      flex: 1,
      headerAlign: "left",
      align: "middle",
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">
            {params.row.subSector}
          </p>
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      renderCell: (params: any) => <ActionMenu row={params.row} />,
    },
  ];

  return (
    <div className="w-full pb-20">
      <Nav />
      <div className="flex items-center px-5 justify-between my-4">
        <div className="flex items-center gap-3">
          <div className="border shadow-sm focus:outline-primary-green border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <DataTable
        isLoading={isLoading}
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

export default SectorSetup;