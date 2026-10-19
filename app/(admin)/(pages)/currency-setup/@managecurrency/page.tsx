"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import { BsThreeDots } from "react-icons/bs";
import SearchIcon from "@/public/icons/SearchIcon";
import DataTable from "@/components/DataTable/DataTable";
import { useRouter } from "next/navigation";
import {
  deleteCurrencyByID,
  softDeleteCurrencyByID,
  updateCurrency,
} from "@/services/features/currencyService";
import { toast } from "sonner";
import StatusPill from "@/components/StatusPill/StatusPill";
import "../index.css";
import Nav from "../components/Nav";
import { Countrieses } from "../components/Countries";
import Pagination from "@/components/Pagination/Pagination";
import ItemsPerPageSelector from "@/components/Pagination/ItemsPerPageSelector";
import useAdmin from "@/hooks/useAdmin";
import { PermissionTypes } from "@/types/permissionTypes";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

interface Currency {
  id: number;
  currency: string;
  symbol: string;
  countryName: string;
  denominations?: any;
  createdOn?: string;
  updatedOn?: string;
  isDeleted?: boolean;
}

interface ActionMenuProps {
  row: Currency;
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
    router.push(`/currency-setup/edit-currency?id=${row.id}`);
  };

  const runAction = async (
    action: () => Promise<unknown>,
    success: string,
    failure: string
  ) => {
    handleClose();
    try {
      await action();
      toast.success(success);
      onDeleteSuccess();
    } catch (error) {
      console.error(failure, error);
      toast.error(failure);
    }
  };

  const handleArchive = () =>
    runAction(
      () => softDeleteCurrencyByID(row.id),
      "Currency archived",
      "Could not archive currency"
    );

  const handleRestore = () =>
    runAction(
      () =>
        updateCurrency({
          id: row.id,
          currency: row.currency,
          symbol: row.symbol,
          countryName: row.countryName,
          denominations: row.denominations,
          isDeleted: false,
          deletedOn: null,
        }),
      "Currency restored",
      "Could not restore currency"
    );

  const handleHardDelete = () => {
    if (
      !window.confirm(
        `Permanently delete ${row.currency}? This cannot be undone.`
      )
    )
      return;
    runAction(
      () => deleteCurrencyByID(row.id),
      "Currency deleted",
      "Could not delete currency"
    );
  };

  return (
    <>
      {/* {checkPermission(PermissionTypes.EDIT_CURRENCY) && ( */}
      <Dropdown>
        <DropdownTrigger>
          <BsThreeDots size={20} />
        </DropdownTrigger>
        {row.isDeleted ? (
          <DropdownMenu aria-label="Archived currency actions">
            <DropdownItem onPress={handleRestore} key="restore">
              Restore
            </DropdownItem>
            <DropdownItem
              onPress={handleHardDelete}
              key="hard-delete"
              color="danger"
            >
              Delete permanently
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Currency actions">
            <DropdownItem onPress={handleEdit} key="edit">
              Edit
            </DropdownItem>
            <DropdownItem onPress={handleArchive} key="archive">
              Archive
            </DropdownItem>
            <DropdownItem
              onPress={handleHardDelete}
              key="hard-delete"
              color="danger"
            >
              Delete permanently
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      {/* )} */}
    </>
  );
};

function CurrencySetup() {
  const [rows, setRows] = useState<Currency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [showArchived, setShowArchived] = useState(false);

  const {
    data: currencies,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all currencies", page, limit, showArchived],
    queryFn: showArchived
      ? services.allCurrenciesIncludingDeleted(page, limit)
      : services.allCurrencies(page, limit),
  });

  const { data: searchData } = useQuery({
    queryKey: ["searchCurrency", searchTerm],
    queryFn: () => services.searchCountryByCurrency(searchTerm),
    enabled: !!searchTerm,
  });

  useEffect(() => {
    if (searchTerm && searchData?.length) {
      // Map searchData to match the original data structure for rows
      const mappedRows = searchData.map((item: any) => ({
        id: item.id,
        currency: item.currency,
        symbol: item.symbol,
        countryName: item.countryName,
        denominations: item.denominations, // You can handle the denominations if needed
        createdOn: item.createdOn,
        updatedOn: item.updatedOn,
        isDeleted: item.isDeleted,
      }));
      setRows(mappedRows); // Update the rows with search results
    } else if (currencies?.content?.length) {
      // Map the original data (currencies) to the row format
      const mappedRows = currencies.content.map((currency: any) => ({
        id: currency.id,
        currency: currency.currency,
        symbol: currency.symbol,
        countryName: currency.countryName,
        denominations: currency.denominations, // Include denominations if needed
        createdOn: currency.createdOn,
        updatedOn: currency.updatedOn,
        isDeleted: currency.isDeleted,
      }));
      setRows(mappedRows); // Maintain original data structure for rows
    } else {
      setRows([]);
    }
  }, [searchData, currencies, searchTerm]);

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
          <div className="flex items-center gap-2">
            <p className="font-medium">{params.row.currency}</p>
            {params.row.isDeleted && <StatusPill status="Archived" />}
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

  return (
    <div className="w-full pb-20">
      <Nav />
      <div className="flex items-center px-5 justify-between my-4">
        <div className="flex items-center gap-3">
          <div className="border shadow-sm  border-gray-200 rounded-xl px-3 py-2 text-sm flex gap-2 items-center">
            <SearchIcon />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm focus:outline-none bg-white input-custom"
              placeholder="Search by currency"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => {
              setShowArchived(e.target.checked);
              setPage(1);
            }}
          />
          Show archived
        </label>
      </div>
      <DataTable isLoading={isLoading} rows={rows} columns={columns} />
      <div className="w-full flex justify-between">
        <ItemsPerPageSelector limit={limit} setLimit={setLimit} />
        <Pagination
          limit={limit}
          currentData={currencies?.totalPages}
          // Endpoint starts from page 1 not 0
          page={page - 1}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default CurrencySetup;
