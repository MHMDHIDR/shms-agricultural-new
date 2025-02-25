"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import clsx from "clsx"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TablePagination } from "@/components/custom/data-table/table-pagination"
import { TableToolbar } from "@/components/custom/data-table/table-toolbar"
import NoRecords from "@/components/custom/no-records"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSharedColumns } from "@/hooks/use-shared-columns"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"
import type { BulkAction } from "@/components/custom/data-table/table-toolbar"
import type { User } from "@prisma/client"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"

export default function InvestorsClientPage({
  investors,
  count,
}: {
  investors: User[]
  count: number
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const toast = useToast()
  const utils = api.useUtils()
  const router = useRouter()

  const handleBulkDeleteOperations = api.operations.bulkDelete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف العمليات بنجاح")
      void utils.operations.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف العمليات")
    },
    onMutate: () => {
      toast.loading("جاري حذف العمليات ...")
    },
  })

  const handleDeleteOperation = (id: string) => {
    handleBulkDeleteOperations.mutate({ operationIds: [id] })
  }

  const { columns, filterFields } = useSharedColumns<User>({
    entityType: "users",
    actions: {
      onDelete: handleDeleteOperation,
      basePath: "/users",
    },
  })

  const table = useReactTable<User>({
    data: investors,
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
    enableColumnPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning: {
        right: ["actions"],
      },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  const getBulkActions = (): BulkAction[] => {
    return [
      {
        label: "حذف المحدد",
        onClick: () => {
          const operationIds = selectedRows.map(row => row.id)
          handleBulkDeleteOperations.mutate({ operationIds })
        },
        variant: "destructive",
        icon: Trash,
      },
    ]
  }

  return !investors || count === 0 ? (
    <NoRecords msg="لم يتم العثور على أي مستثمرين في الوقت الحالي" />
  ) : (
    <div className="space-y-4">
      <TableToolbar<User>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مستثمر"
        bulkActions={getBulkActions()}
        filterFields={filterFields}
      />

      <TablePagination table={table} selectedRows={selectedRows} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className="select-none">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const isPinned = header.column.getIsPinned()

                  return (
                    <TableHead
                      key={header.id}
                      className={clsx(
                        "text-center",
                        isPinned && "sticky left-0 bg-background shadow-[1px_0_0_0_#e5e7eb]",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => {
                    const isPinned = cell.column.getIsPinned()
                    return (
                      <TableCell
                        key={cell.id}
                        className={clsx(
                          "text-center",
                          isPinned && "sticky left-0 bg-background shadow-[1px_0_0_0_#e5e7eb]",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  لم يتم العثور على نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} selectedRows={selectedRows} />
    </div>
  )
}
