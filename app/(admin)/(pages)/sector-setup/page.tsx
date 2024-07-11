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

interface RowData {
  id: number;
  parentSector: string;
  subSectorCount: number;
}

interface ActionMenuProps {
  row: RowData;
  onDeleteSuccess: () => void;
  countryId: number | undefined;
}

interface SectorStat {
  parentSector: string;
  id: number;
  subSectorCount: number;
}


interface DataItem {
  sectorStats: SectorStat[];
  id: number;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  row,
  onDeleteSuccess,
  countryId,
}) => {
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
      `/sector-setup/edit-sector?id=${row.id}&countryId=${countryId}`
    );
  };

  const handleDelete = async () => {
    handleClose();
    try {
      await deleteBySubSectorID(row.id);
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
  const [rows, setRows] = useState<RowData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data, isLoading, refetch } = useQuery<DataItem[], Error>({
    queryKey: ['all sectors', searchTerm],
    queryFn:  services.getSectorByCountry(searchTerm),
    enabled: !!searchTerm, 
  });


  useEffect(() => {
    if (data) {
      const allRows = data.flatMap(item => item.sectorStats); // Flatten sectorStats from all items
      setRows(allRows);
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
          <div>
            <p className="font-medium">{params.row.parentSector}</p>
          </div>
          </div>
        </div>,
      ],
    },
    {
      field: "subSectors",
      headerName: "Sub Sectors",
      flex: 1,
      headerAlign: "left",
      align: "middle",
      type: "actions",
      getActions: (params: any) => [
        <div key={params.row.id} className="flex flex-col gap-2">
          <p className="font-medium text-sm">{params.row.subSectorCount}</p>
        </div>,
      ],
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      renderCell: (params: any) =>
        data && data.length > 0 ? (
          <ActionMenu
            row={params.row}
            onDeleteSuccess={handleDeleteSuccess}
            countryId={data[0]?.id}
          />
        ) : null,
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
              className="outline-none text-sm focus:outline-none bg-white input-custom"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <DataTable isLoading={isLoading} rows={rows} columns={columns} />
    </div>
  );
};

export default SectorSetup;
