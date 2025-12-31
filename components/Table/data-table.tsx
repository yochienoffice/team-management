"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { DataTablePagination } from "./data-table-pagination";
import { MemberSheet } from "@/app/users/MemberSheet";
import { MemberItem } from "@/utils/Models";
import { DataTableRowAction, DataTableType } from "./types";
import { EditScheduleSheet } from "@/app/schedule-management/schedule/EditScheduleSheet";
import { ActionType } from "@/app/api/model/enums/ActionType";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter: DataTableType;
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  param?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  param,
  updateData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchOperator, setSearchOperator] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [dataList, setDataList] = useState<TData[]>(data);
  const [isEditable, setEditable] = useState<boolean>(false);

  const [rowAction, setRowAction] = useState<
    DataTableRowAction<MemberItem> | DataTableRowAction<Schedule> | null
  >(null);

  const { toast } = useToast();

  useEffect(() => {
    // fetch data
  }, []);

  useEffect(() => {
    if (param as string) {
      // filter / param filters settings
    }
  }, [param]);

  useEffect(() => {
    setDataList(data);
  }, [data]);

  const handleSaveEvent = async (rowIndex: number) => {};

  const table = useReactTable({
    data: dataList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    meta: {
      setRowAction,
      updateData
    },
  });

  function renderSheet(filter: DataTableType) {
    if (filter === DataTableType.USERS) {
      return rowAction?.type === ActionType.UPDATE ? (
        <MemberSheet
          open={rowAction?.type === ActionType.UPDATE}
          onOpenChange={() => setRowAction(null)}
          type={rowAction?.tableType}
          member={rowAction?.row?.original ?? null}
        />
      ) : null;
    } else if (filter === DataTableType.SCHEDULE) {
      return rowAction?.type === ActionType.UPDATE ? (
        <EditScheduleSheet
          open={rowAction?.type === ActionType.UPDATE}
          onOpenChange={() => setRowAction(null)}
          type={rowAction?.type}
          schedule={rowAction?.row?.original ?? null}
          dataSize={rowAction?.dataSize}
        />
      ) : null;
    }
  }

  return (
    <div>
      {/* the filter stuff below will get deleted upon ccreport implementation */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-yellow-100 hover:bg-yellow-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Toaster />
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
      {renderSheet(filter)}
    </div>
  );
}
