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

    return localRows.slice(start, end).map((row: any, index: number) => {
      const rowKey = `row-${start + index}-${row?.id ?? "unknown"}`;

      return {
        ...row,
        key: rowKey,
        id: rowKey,
        __originalId: row?.id,
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
          base: "overflow-x-auto",
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
            <TableRow key={item.key}>
              {columns.map((column: any, colIndex: number) => {
                const cellKey = `${item.key}-${column.field ?? colIndex}`;
                let content: React.ReactNode;

                if (column.getActions) {
                  const actions = column.getActions({ row: item });
                  content = Array.isArray(actions)
                    ? actions.map((action: React.ReactNode, actionIndex: number) => {
                        const actionKey = `${cellKey}-action-${actionIndex}`;
                        if (React.isValidElement(action)) {
                          return React.cloneElement(action, {
                            key: action.key ?? actionKey,
                          });
                        }
                        return (
                          <React.Fragment key={actionKey}>{action}</React.Fragment>
                        );
                      })
                    : actions;
                } else if (column.renderCell) {
                  content = column.renderCell({ row: item });
                } else if (column.field === "id" && item.__originalId != null) {
                  content = item.__originalId;
                } else {
                  content = item[column.field];
                }

                return <TableCell key={cellKey}>{content}</TableCell>;
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
