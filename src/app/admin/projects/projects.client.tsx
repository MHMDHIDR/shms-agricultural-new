"use client";

import type { BulkAction } from "@/components/custom/data-table/table-toolbar";
import { TableToolbar } from "@/components/custom/data-table/table-toolbar";
import NoRecords from "@/components/custom/no-records";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSharedColumns } from "@/hooks/use-shared-columns";
import type { Projects } from "@prisma/client";
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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ProjectsClientPage({
  projects,
}: {
  projects: Projects[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filtering, setFiltering] = useState("");

  // Handle project actions
  const handleDeleteProject = (_id: string) => {
    void (async () => {
      // Implement delete functionality
      toast.error("Delete functionality not implemented yet");
    })();
  };

  const handleActivateProject = (_id: string) => {
    void (async () => {
      // Implement activate functionality
      toast.success("Activate functionality not implemented yet");
    })();
  };

  const handleDeactivateProject = (_id: string) => {
    void (async () => {
      // Implement deactivate functionality
      toast.warning("Deactivate functionality not implemented yet");
    })();
  };

  const { columns, filterFields } = useSharedColumns<Projects>({
    entityType: "projects",
    actions: {
      onDelete: handleDeleteProject,
      onActivate: handleActivateProject,
      onDeactivate: handleDeactivateProject,
      basePath: "/projects",
    },
  });

  const table = useReactTable<Projects>({
    data: projects,
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
          toast.error("Bulk delete not implemented yet", {
            description: `Selected IDs: ${ids.join(", ")}`,
          });
        },
        variant: "destructive",
      },
    ];

    if (selectedRows.length > 0) {
      const hasPendingProjects = selectedRows.some(
        (row) => row.projectStatus === "pending",
      );
      const hasActiveProjects = selectedRows.some(
        (row) => row.projectStatus === "active",
      );

      if (hasPendingProjects) {
        actions.push({
          label: "تفعيل المحدد",
          onClick: () => {
            const ids = selectedRows.map((row) => row.id);
            toast.success("Bulk activate not implemented yet", {
              description: `Selected IDs: ${ids.join(", ")}`,
            });
          },
          variant: "success",
        });
      }

      if (hasActiveProjects) {
        actions.push({
          label: "تعطيل المحدد",
          onClick: () => {
            const ids = selectedRows.map((row) => row.id);
            toast.warning("Bulk deactivate not implemented yet", {
              description: `Selected IDs: ${ids.join(", ")}`,
            });
          },
          variant: "success",
        });
      }
    }

    return actions;
  };

  if (!projects.length) {
    return (
      <NoRecords
        msg="لم يتم العثور على أي مشاريع استثمارية في الوقت الحالي"
        links={[
          {
            to: "/admin/projects/new",
            label: "إضافة مشروع جديد",
          },
        ]}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">المشاريع</h2>
        <Link href="/admin/projects/new">
          <Button>إضافة مشروع جديد</Button>
        </Link>
      </div>

      <TableToolbar<Projects>
        table={table}
        filtering={filtering}
        setFiltering={setFiltering}
        selectedRows={selectedRows}
        searchPlaceholder="البحث في المشاريع..."
        bulkActions={getBulkActions()}
        filterFields={filterFields}
      />

      <div className="rounded-md border">
        <TableComponent>
          <TableHeader>
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
        </TableComponent>
      </div>
    </div>
  );
}
