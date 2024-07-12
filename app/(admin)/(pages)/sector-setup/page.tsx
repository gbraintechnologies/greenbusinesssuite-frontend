"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import DataTable from "@/components/DataTable/DataTable";
import services from "@/services";
import Nav from "./components/Nav";
import { useRouter } from "next/navigation";
import { deleteBySubSectorID } from "@/services/features/sectorService";
import { Countrieses } from "./components/Countries";

interface ParentSector {
  id: number;
  parentSector: string;
  subSectorCount: number;
}

interface RowData {
  id: number;
  countryName: string;
  parentSectors: ParentSector[];
}

interface FlattenedRowData {
  id: number;
  rowId: number;
  countryId: number;
  countryName: string;
  parentSector: string;
  subSectorCount: number;
}

interface ActionMenuProps {
  row: FlattenedRowData;
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

  const handleEdit = () => {
    handleClose();
    router.push(
      `/sector-setup/edit-sector?id=${row.rowId}&countryId=${row.countryId}`
    );
  };

  const handleDelete = async () => {
    handleClose();
    try {
      await deleteBySubSectorID(row.rowId);
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
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const SectorSetup: React.FC = () => {
  const [rows, setRows] = useState<FlattenedRowData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allSectors"],
    queryFn: services.allParentSectors(),
  });

  useEffect(() => {
    if (data) {
      const flattenedData = data.flatMap((sector: RowData) =>
        sector.parentSectors.map((parentSector) => ({
          id: parentSector.id, // unique identifier for each row (MUI DataGrid requirement)
          rowId: parentSector.id, // unique identifier for each row
          countryId: sector.id,
          countryName: sector.countryName,
          parentSector: parentSector.parentSector,
          subSectorCount: parentSector.subSectorCount,
        }))
      );
      setRows(flattenedData);
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
      field: "countryName",
      headerName: "Country",
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params: any) => (
        <div className="flex py-3 gap-4 my-3 items-center">
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
            <p className="font-medium">{params.row.countryName}</p>
          </div>
        </div>
      ),
    },
    {
      field: "parentSector",
      headerName: "Sectors",
      flex: 1,
      headerAlign: "left",
      align: "middle",
      renderCell: (params: any) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">{params.row.parentSector}</p>
        </div>
      ),
    },
    {
      field: "subSectorCount",
      headerName: "Sub Sectors",
      flex: 1,
      headerAlign: "left",
      align: "middle",
      renderCell: (params: any) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium text-sm">{params.row.subSectorCount}</p>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <ActionMenu row={params.row} onDeleteSuccess={handleDeleteSuccess} />
      ),
    },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.parentSector.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="outline-none text-sm focus:outline-none bg-white input-custom"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
      <DataTable isLoading={isLoading} rows={filteredRows} columns={columns} />
    </div>
  );
};

export default SectorSetup;
