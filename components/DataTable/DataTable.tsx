"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";

function DataTable({
  rows,
  columns,
  pagination = 100,
  sortField = "orderDate",
  sort = "desc",
  checkboxes = false,
  rowsPerView,
  isLoading,
  onSelectionChange,
}: any) {
  const [localRows, setLocalRows] = useState(rows);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));

  const rowsPerPage = rowsPerView || pagination || 10;

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const pages = Math.ceil(localRows.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return localRows.slice(start, end);
  }, [page, localRows, rowsPerPage]);

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(keys);
    if (onSelectionChange) {
      onSelectionChange(keys);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full">
        <div className="flex items-center text-left bg-gray-100 font-medium py-5 justify-between gap-5 px-5 mb-4 rounded-t-lg">
          {columns.map((column: any, index: number) => {
            return (
              <div className="text-left text-xs uppercase w-full" key={index}>
                <h4>
                  {column.headerName ||
                    column.renderHeader?.()?.props?.children ||
                    column.field}
                </h4>
              </div>
            );
          })}
        </div>
        {/* @ts-ignore */}
        {Array.apply(null, { length: 7 }).map((e, i) => (
          <div
            className="flex items-center mb-4 justify-between p-3 gap-4 mx-5 border border-gray-200 bg-white rounded-lg"
            key={i}
          >
            {columns.map((_: any, index: number) => {
              return (
                <div
                  className="h-6 w-full bg-gray-200 rounded-lg animate-pulse"
                  key={index}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table
        aria-label="Data table with dynamic content"
        selectionMode={checkboxes ? "multiple" : "none"}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader>
          {columns.map((column: any, index: number) => (
            <TableColumn
              key={column.field || index}
              align={column.align || column.headerAlign || "start"}
            >
              {column.renderHeader
                ? typeof column.renderHeader === "function"
                  ? column.renderHeader()
                  : column.renderHeader
                : column.headerName || column.field}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={items} emptyContent="No data to display">
          {(item: any) => (
            <TableRow key={item.id}>
              {columns.map((column: any, colIndex: number) => (
                <TableCell key={column.field || colIndex}>
                  {column.getActions
                    ? column.getActions({ row: item })
                    : column.renderCell
                    ? column.renderCell({ row: item })
                    : item[column.field]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
