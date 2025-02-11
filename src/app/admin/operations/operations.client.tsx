"use client";

import type { BulkAction } from "@/components/custom/data-table/table-toolbar";
import { TableToolbar } from "@/components/custom/data-table/table-toolbar";
import NoRecords from "@/components/custom/no-records";
import {
  TableBody,
  TableCell,
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSharedColumns } from "@/hooks/use-shared-columns";
import type { withdraw_actions } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function OperationsClientPage({
  operations,
  count,
}: {
  operations: withdraw_actions[];
  count: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useToast();

  // Handle operation actions
  const handleDeleteOperation = () => {
    void (async () => {
      toast.error("Delete functionality not implemented yet");
    })();
  };

  const { columns, filterFields } = useSharedColumns<withdraw_actions>({
    entityType: "withdraw_actions",
    actions: {
      onDelete: handleDeleteOperation,
      basePath: "/operations",
    },
  });

  const table = useReactTable<withdraw_actions>({
    data: operations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  // Define bulk actions
  const getBulkActions = (): BulkAction[] => {
    return [
      {
        label: "حذف المحدد",
        onClick: () => {
          const ids = selectedRows.map((row) => row.id);
          toast.success(`Selected IDs: ${ids.join(", ")}`);
        },
        variant: "destructive",
      },
    ];
  };

  return !operations || count === 0 ? (
    <NoRecords msg="لم يتم العثور على أي عمليات مالية في الوقت الحالي" />
  ) : (
    <div className="space-y-4">
      <TableToolbar<withdraw_actions>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن عملية"
        bulkActions={getBulkActions()}
        filterFields={filterFields}
      />

      <div className="rounded-md border px-2.5">
        <Table>
          <TableHeader className="select-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  لم يتم العثور على نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
