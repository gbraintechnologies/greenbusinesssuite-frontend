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

function renderCellContent(column: any, item: any) {
  if (!column) return null;

  if (column.getActions) {
    const actions = column.getActions({ row: item });
    if (Array.isArray(actions)) {
      if (actions.length === 1) return actions[0];
      return (
        <div className="flex min-w-0 items-center gap-2">
          {actions.map((action: React.ReactNode, actionIndex: number) => (
            <React.Fragment
              key={`${item.key}-${column.uid}-action-${actionIndex}`}
            >
              {action}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return actions;
  }

  if (column.renderCell) {
    return column.renderCell({ row: item });
  }

  if (column.field === "id" && item.__originalId != null) {
    return item.__originalId;
  }

  return item[column.field];
}

function DataTable({
  rows,
  columns,
  pagination = 100,
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

  const tableColumns = useMemo(
    () =>
      (columns || []).map((column: any, index: number) => ({
        ...column,
        uid: String(column.field ?? `col-${index}`),
      })),
    [columns]
  );

  const pages = Math.ceil((localRows?.length || 0) / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const source = Array.isArray(localRows) ? localRows : [];

    return source.slice(start, end).map((row: any, index: number) => {
      const originalId = row?.__originalId ?? row?.id ?? row?.data?.id;
      const rowKey = `row-${start + index}-${originalId ?? "unknown"}`;

      return {
        ...row,
        key: rowKey,
        id: rowKey,
        __originalId: originalId,
      };
    });
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
        <div className="mb-4 hidden items-center justify-between gap-5 rounded-t-lg bg-gray-100 px-5 py-5 text-left font-medium sm:flex">
          {tableColumns.map((column: any) => (
            <div className="w-full text-left text-xs uppercase" key={column.uid}>
              <h4>
                {column.headerName ||
                  column.renderHeader?.()?.props?.children ||
                  column.field}
              </h4>
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            className="mx-5 mb-4 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3"
            key={i}
          >
            {tableColumns.map((column: any) => (
              <div
                className="h-6 w-full animate-pulse rounded-lg bg-gray-200"
                key={column.uid}
              />
            ))}
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
                onChange={(nextPage) => setPage(nextPage)}
              />
            </div>
          ) : null
        }
        classNames={{
          base: "overflow-x-auto",
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader columns={tableColumns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.align || column.headerAlign || "start"}
            >
              {column.renderHeader
                ? typeof column.renderHeader === "function"
                  ? column.renderHeader()
                  : column.renderHeader
                : column.headerName || column.field}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No data to display">
          {(item: any) => (
            <TableRow key={item.key}>
              {(columnKey) => {
                const column = tableColumns.find(
                  (col: any) => col.uid === String(columnKey)
                );
                return (
                  <TableCell>{renderCellContent(column, item)}</TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
