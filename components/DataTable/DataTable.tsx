import React, { useState, useEffect } from "react";

// icons
import { GrCheckbox } from "react-icons/gr";
import { ImCheckboxChecked } from "react-icons/im";

import Checkbox from "@mui/material/Checkbox";

import {
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosArrowUp,
  IoIosArrowDown,
} from "react-icons/io";

// mui styles
import {
  DataGrid,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";

// custom css
import "./index.css";

// Loader
import LoadingIcon from "../LoadingIcon/LoadingIcon";

function CustomPagination(pageCount: any) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  // const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    // <Pagination
    //   color="primary"
    //   variant="outlined"
    //   shape="rounded"
    //   page={page + 1}
    //   count={pageCount}
    //   // @ts-expect-error
    //   renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
    //   onChange={(event: React.ChangeEvent<unknown>, value: number) =>
    //     apiRef.current.setPage(value - 1)
    //   }
    // />
    <div></div>
  );
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === "light"
      ? "rgba(0,0,0,.85)"
      : "rgba(255,255,255,0.85)",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-cell": {
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.65)",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
}));

function DataTable({
  rows,
  columns,
  totalCount,
  pagination = 100,
  sortField = "orderDate",
  sort = "desc",
  checkboxes = false,
  setSelectedRows,
  rowsPerView,
  setRowsPerView,
  isLoading,
}: any) {
  // local works
  const [localRows, setLocalRows] = useState(rows);

  const [page, setPage] = useState(1);

  const [localRowsView, setLocalRowsView] = useState(rowsPerView);

  // sync localRowsView and rowsPerView
  useEffect(() => {
    if (localRowsView !== rowsPerView) {
      setLocalRowsView(rowsPerView);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerView]);

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  return (
    <>
      {isLoading ? (
        <div className="h-[30vh] w-full">
          <LoadingIcon />
        </div>
      ) : (
        <>
          <StyledDataGrid
            rowHeight={80}
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
            rows={localRows}
            onRowSelectionModelChange={(ids: any) => {
              const selectedIDs = new Set(ids);
              const selectedRowData = localRows.filter((row: any) =>
                selectedIDs.has(row.id.toString())
              );
              setSelectedRows(selectedRowData);
            }}
            columns={columns}
            loading={isLoading}
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination,
                },
              },
              sorting: {
                sortModel: [{ field: sortField, sort: sort }],
              },
            }}
            getRowId={(row: any) => row.id}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={checkboxes}
            autoHeight={true}
            slots={{
              pagination: CustomPagination,
              baseCheckbox: (props: any) => (
                <Checkbox
                  {...props}
                  checkedIcon={
                    <ImCheckboxChecked className="text-gepasecondary" />
                  }
                  icon={<GrCheckbox />}
                />
              ),
            }}
            // disableRowSelectionOnClick
          />

          {/* CUSTOM PAGINATION */}
          {rows && (
            <></>
            // <div className="z-50 mb-10 px-5 py-2 flex items-center justify-between text-sm">
            //   <div className="flex items-center gap-2">
            //     <div className="flex divide-x divide-gray-300 rounded-lg  items-center border border-gray-300">
            //       <form
            //         onSubmit={(e) => {
            //           e.preventDefault();
            //           setRowsPerView(parseInt(localRowsView));
            //         }}
            //       >
            //         <input
            //           min={1}
            //           max={totalCount}
            //           value={localRowsView}
            //           onChange={(e) =>
            //             setLocalRowsView(parseInt(e.target.value))
            //           }
            //           className="px-3 inline border-none focus:outline-0 w-12"
            //           type="number"
            //         />
            //       </form>
            //       <div className="cursor-pointer flex flex-col text-center">
            //         <button
            //           onClick={() => setRowsPerView(rowsPerView + 1)}
            //           className="px-3"
            //         >
            //           <IoIosArrowUp size={14} />
            //         </button>

            //         <button
            //           onClick={() => setRowsPerView(rowsPerView - 1)}
            //           className="px-3"
            //         >
            //           <IoIosArrowDown size={14} />
            //         </button>
            //       </div>
            //     </div>
            //     Entries per page
            //   </div>
            //   <p>
            //     {" "}
            //     <p>
            //       Showing: 1 -{" "}
            //       {rowsPerView > totalCount ? totalCount : rowsPerView} of{" "}
            //       {totalCount}
            //     </p>
            //   </p>
            //   <div className="flex gap-2 items-center">
            //     <button className="text-sm border border-gray-300 p-2 rounded-lg">
            //       <IoIosArrowBack size={12} />
            //     </button>
            //     <button className="text-sm border border-gray-300 p-2 rounded-lg">
            //       <IoIosArrowForward size={12} />
            //     </button>
            //   </div>
            // </div>
          )}
        </>
      )}
    </>
  );
}

export default DataTable;
