"use client";

import type { BulkAction } from "@/components/custom/data-table/table-toolbar";
import { TableToolbar } from "@/components/custom/data-table/table-toolbar";
import NoRecords from "@/components/custom/no-records";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSharedColumns } from "@/hooks/use-shared-columns";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@prisma/client";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

export default function UsersClientPage({
  users,
  count,
}: {
  users: User[];
  count: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filtering, setFiltering] = useState("");
  const toast = useToast();

  // Handle user actions
  const handleDeleteUser = (_id: string) => {
    void (async () => {
      // Implement delete functionality
      toast.error("Delete functionality not implemented yet");
    })();
  };

  const handleBlockUser = (_id: string) => {
    void (async () => {
      // Implement block functionality
      toast.loading("Block functionality not implemented yet");
    })();
  };

  const handleUnblockUser = (_id: string) => {
    void (async () => {
      // Implement unblock functionality
      toast.success("Unblock functionality not implemented yet");
    })();
  };

  const { columns, filterFields } = useSharedColumns<User>({
    entityType: "users",
    actions: {
      onDelete: handleDeleteUser,
      onBlock: handleBlockUser,
      onUnblock: handleUnblockUser,
      basePath: "/users",
    },
  });

  const table = useReactTable<User>({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
    },
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  // Define bulk actions
  const getBulkActions = (): BulkAction[] => {
    const actions: BulkAction[] = [
      {
        label: "حذف المحدد",
        onClick: () => {
          const ids = selectedRows.map((row) => row.id);
          toast.success(`Selected IDs: ${ids.join(", ")}`);
        },
        variant: "destructive",
      },
    ];

    if (selectedRows.length > 0) {
      const hasBlockedUsers = selectedRows.some(
        (row) => row.accountStatus === "block",
      );
      const hasActiveUsers = selectedRows.some(
        (row) => row.accountStatus === "active",
      );

      if (hasActiveUsers) {
        actions.push({
          label: "حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map((row) => row.id);
            toast.success(`Selected IDs: ${ids.join(", ")}`);
          },
          variant: "destructive",
        });
      }

      if (hasBlockedUsers) {
        actions.push({
          label: "إلغاء حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map((row) => row.id);
            toast.success(`Selected IDs: ${ids.join(", ")}`);
          },
          variant: "success",
        });
      }
    }

    return actions;
  };

  return !users || count === 0 ? (
    <NoRecords msg="لم يتم العثور على أي مستخدمين في الوقت الحالي" />
  ) : (
    <div className="space-y-4">
      <TableToolbar<User>
        table={table}
        filtering={filtering}
        setFiltering={setFiltering}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مستخدم"
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
