"use client";

import React, { JSX } from "react";
import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

import { Pagination } from "@heroui/pagination";

import { Input } from "@heroui/input";

// icons
import { LuSearch } from "react-icons/lu";
import { FaSpinner } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";

function Table({
  isLoading,
  title = "",
  data,
  columns,
  hasSearch = false,
  setPage,
  searchPlaceholder,
  searchValue,
  showTopPagination = true,
  searchType,
  totalPages,
  rowsPerPage = 25,
  setSearchValue,
  actionsComponent,
  statusComponent,
  downloadComponent,
  page,
  topNav,
}: {
  isLoading: boolean;
  data: any[];
  showTopPagination?: Boolean;
  title?: string;
  hasSearch: boolean;
  topNav?: () => JSX.Element;
  columns: { name: string; uid: string; sortable?: boolean }[];
  page: number;
  rowsPerPage?: number;
  setPage?: any;
  actionsComponent?: (item: any) => JSX.Element;
  statusComponent?: (item: any) => JSX.Element;
  downloadComponent?: (item: any) => JSX.Element;
  searchType?: "email" | "text";
  searchPlaceholder?: string;
  searchValue?: string;
  setSearchValue?: any;
  totalPages?: number;
}) {
  // PAGINATION STUFF
  const tableData: any = React.useMemo(() => {
    return (data ?? []).map((item, index) => {
      const rowKey = `row-${index}-${item?.id ?? "unknown"}`;

      return {
        ...item,
        key: rowKey,
        id: rowKey,
        __originalId: item?.id,
      };
    });
  }, [data]);

  const getCellValue = (item: any, columnKey: React.Key) => {
    if (columnKey === "id" && item?.__originalId != null) {
      return item.__originalId;
    }

    return getKeyValue(item, columnKey as string | number);
  };

  const handleClear = () => {
    setPage(1);
    setSearchValue("");
  };

  const bottomContent = React.useMemo(() => {
    return (
      <>
        {totalPages && totalPages > 1 && (
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            page={page}
            total={totalPages}
            variant="light"
            onChange={setPage}
          />
        )}
      </>
    );
  }, [data?.length, page, totalPages, hasSearch]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-lg font-semibold text-nowrap">{title && title}</p>

          <div className="w-full  flex flex-col md:flex-row items-center justify-start md:justify-end md:items-end gap-4">
            {hasSearch && (
              <Input
                isClearable
                classNames={{
                  base: "w-full md:max-w-[22rem]",
                  inputWrapper: "border-1",
                }}
                type={searchType}
                placeholder={searchPlaceholder}
                startContent={<LuSearch />}
                value={searchValue}
                variant="bordered"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onClear={handleClear}
              />
            )}
            {topNav && topNav()}
            <>
              {showTopPagination && totalPages && totalPages > 1 && (
                <Pagination
                  showControls
                  classNames={{
                    cursor: "bg-foreground text-background",
                  }}
                  color="default"
                  page={page}
                  total={totalPages}
                  variant="light"
                  onChange={setPage}
                />
              )}
            </>
          </div>
        </div>
      </div>
    );
  }, [data.length, searchValue]);

  const classNames = React.useMemo(
    () => ({
      base: "pb-6 rounded-none",
      table: "min-w-[680px] w-max md:w-full table-fixed",
      th: [
        "bg-gray-50",
        "text-black",
        "border-none",
        "rounded-none",
        "py-4",
        "uppercase",
        "whitespace-nowrap",
      ],
      tr: ["!rounded-none", "!shadow-none"],
      td: [
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
        "py-5",
        "align-middle",
      ],
    }),
    []
  );

  const columnWidthClass = (uid: string) => {
    switch (uid) {
      case "id":
        return "w-[56px]";
      case "name":
        return "w-[22%]";
      case "email":
        return "w-[30%]";
      case "phone":
        return "w-[16%]";
      case "status":
        return "w-[110px]";
      case "actions":
        return "w-[72px] sticky right-0 z-20";
      default:
        return undefined;
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <NextUITable
        radius="none"
        layout="fixed"
        isHeaderSticky
        fullWidth
        removeWrapper
        aria-label={title}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectionMode="none"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className={columnWidthClass(column.uid)}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={tableData ? tableData : []}
          loadingContent={<AiOutlineLoading className="animate-spin" />}
          emptyContent={<div>No {title} found</div>}
          isLoading={isLoading}
        >
          {(item: any) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell
                  className={
                    columnKey === "actions"
                      ? "sticky right-0 z-10 bg-transparent text-center align-middle"
                      : "overflow-hidden text-left align-middle"
                  }
                >
                  {columnKey === "actions" && actionsComponent?.(item)}
                  {columnKey === "status" && statusComponent?.(item)}
                  {columnKey === "download" && downloadComponent?.(item)}
                  {columnKey !== "actions" &&
                    columnKey !== "status" &&
                    columnKey !== "download" && (
                      <span
                        className="block max-w-full truncate"
                        title={String(getCellValue(item, columnKey) ?? "")}
                      >
                        {getCellValue(item, columnKey)}
                      </span>
                    )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </div>
  );
}

export default Table;
