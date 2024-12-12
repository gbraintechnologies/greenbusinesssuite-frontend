import React, { useState, useEffect } from "react";

// icons
import { GrCheckbox } from "react-icons/gr";
import { ImCheckboxChecked } from "react-icons/im";

import Checkbox from "@mui/material/Checkbox";

// mui styles
import { DataGrid } from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";

// custom css
import "./index.css";

function CustomPagination() {
  return <div></div>;
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
  pagination = 100,
  sortField = "orderDate",
  sort = "desc",
  checkboxes = false,
  rowsPerView,
  isLoading,
}: any) {
  // local works
  const [localRows, setLocalRows] = useState(rows);

  const [page, setPage] = useState(1);

  const [localRowsView, setLocalRowsView] = useState(rowsPerView);

  const [rowSelectionModel, setRowSelectionModel] = useState();

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
        <div className="min-h-[60vh] w-full">
          <div className="flex items-center text-left bg-gray-100 font-medium py-5 justify-between gap-5 px-5 mb-4">
            {columns.map((column: any, index: number) => {
              return (
                <div className="text-left text-xs uppercase  w-full" key={index}>
                  <h4>{column.headerName}</h4>
                </div>
              );
            })}
          </div>
          {/* @ts-ignore */}
          {Array.apply(null, { length: 7 }).map((e, i) => (
            <div className="flex items-center mb-4 justify-between p-3 gap-4 mx-5 border border-gray-200 bg-white  rounded-lg" key={i}>
              {columns.map((_: any,index: number) => {
                return (
                  <div className="h-6 w-full bg-gray-200 rounded-lg animate-pulse" key={index}/>
                );
              })}
            </div>
          ))}
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
            onRowSelectionModelChange={(newRowSelectionModel: any) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            columns={columns}
            loading={isLoading}
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
          />
        </>
      )}
    </>
  );
}

export default DataTable;
