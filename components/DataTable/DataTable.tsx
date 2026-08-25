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
import { PiEmpty } from "react-icons/pi";

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
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="hidden items-center gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:flex">
          {tableColumns.map((column: any) => (
            <div className="h-3 w-full max-w-[8rem] animate-pulse rounded bg-slate-200" key={column.uid} />
          ))}
        </div>
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="h-12 w-full animate-pulse rounded-lg bg-slate-100"
              key={i}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table
          aria-label="Data table with dynamic content"
          selectionMode={checkboxes ? "multiple" : "none"}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          removeWrapper
          bottomContent={
            pages > 1 ? (
              <div className="flex w-full justify-center border-t border-slate-100 py-3">
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
            base: "w-full min-w-[720px]",
            table: "min-w-[720px]",
            thead: "[&>tr]:first:shadow-none",
            th: "bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap first:rounded-none last:rounded-none",
            td: "whitespace-nowrap py-3.5 text-sm text-slate-700",
            tr: "border-b border-slate-100 last:border-b-0",
            emptyWrapper: "min-h-[220px] text-slate-400",
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
          <TableBody
            items={items}
            emptyContent={
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-400">
                <PiEmpty size={40} />
                <p className="text-sm">No data to display</p>
              </div>
            }
          >
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
    </div>
  );
}

export default DataTable;
