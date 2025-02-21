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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TableToolbar } from "@/components/custom/data-table/table-toolbar"
import NoRecords from "@/components/custom/no-records"
import { Button } from "@/components/ui/button"
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
import type {
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table"

export default function UsersClientPage({ users, count }: { users: User[]; count: number }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const toast = useToast()
  const utils = api.useUtils()
  const router = useRouter()

  const handleDeleteSingleUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري حذف المستخدم ...")
    },
  })

  const handleBlockSingleUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("تم حظر المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حظر المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري حظر المستخدم ...")
    },
  })

  const handleUnblockSingleUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("تم إلغاء حظر المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء إلغاء حظر المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري إلغاء حظر المستخدم ...")
    },
  })

  // Handle user actions
  const handleDeleteUser = (id: string) => {
    void handleDeleteSingleUser.mutate({ id })
  }

  const handleBlockUser = (id: string) => {
    void handleBlockSingleUser.mutate({ id, accountStatus: "block" })
  }

  const handleUnblockUser = (id: string) => {
    void handleUnblockSingleUser.mutate({ id, accountStatus: "active" })
  }

  const { columns, filterFields } = useSharedColumns<User>({
    entityType: "users",
    actions: {
      onDelete: handleDeleteUser,
      onBlock: handleBlockUser,
      onUnblock: handleUnblockUser,
      basePath: "/users",
    },
  })

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

  // Define bulk actions
  const getBulkActions = (): BulkAction[] => {
    const actions: BulkAction[] = [
      {
        label: "حذف المحدد",
        onClick: () => {
          const ids = selectedRows.map(row => row.id)
          toast.success(`Selected IDs: ${ids.join(", ")}`)
        },
        variant: "destructive",
      },
    ]

    if (selectedRows.length > 0) {
      const hasBlockedUsers = selectedRows.some(row => row.accountStatus === "block")
      const hasActiveUsers = selectedRows.some(row => row.accountStatus === "active")

      if (hasActiveUsers) {
        actions.push({
          label: "حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map(row => row.id)
            toast.success(`Selected IDs: ${ids.join(", ")}`)
          },
          variant: "destructive",
        })
      }

      if (hasBlockedUsers) {
        actions.push({
          label: "إلغاء حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map(row => row.id)
            toast.success(`Selected IDs: ${ids.join(", ")}`)
          },
          variant: "success",
        })
      }
    }

    return actions
  }

  return !users || count === 0 ? (
    <NoRecords msg="لم يتم العثور على أي مستخدمين في الوقت الحالي" />
  ) : (
    <div className="space-y-4">
      <TableToolbar<User>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مستخدم"
        bulkActions={getBulkActions()}
        filterFields={filterFields}
      />

      <TablePagination table={table} />
      <div className="rounded-md border px-2.5">
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
      <TablePagination table={table} />
    </div>
  )
}

function TablePagination({ table }: { table: TableType<User> }) {
  return (
    <div className="flex gap-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="cursor-pointer"
      >
        <ChevronRightIcon className="h-4 w-4" />
        السابق
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="cursor-pointer"
      >
        التالي
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
