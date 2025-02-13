"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import type { Projects } from "@prisma/client"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"

export default function ProfitsPercentageTable({ projects }: { projects: Projects[] }) {
  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const { mutate: deleteProfitsPercentage } = api.projects.deleteProfitsPercentage.useMutation({
    onMutate: () => {
      toast.loading("جاري حذف نسبة الربح...")
    },
    onSuccess: async () => {
      toast.success("تم حذف نسبة الربح بنجاح")
      await utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
  })

  const projectsWithPercentage = projects.filter(project => project.projectSpecialPercentageCode)

  const { columns, filterFields } = useSharedColumns<Projects>({
    entityType: "profits_percentage",
    actions: {
      onDelete: (id: string) => {
        deleteProfitsPercentage({ projectId: id })
      },
      basePath: "/profits-percentage",
    },
  })

  const table = useReactTable({
    data: projectsWithPercentage,
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
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  return projectsWithPercentage.length === 0 ? (
    <NoRecords msg="لا توجد رموز زيادة نسبة الربح" />
  ) : (
    <div className="space-y-4">
      <TableToolbar
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن نسبة ربح"
        filterFields={filterFields}
      />

      <div className="rounded-md border px-2.5">
        <Table>
          <TableHeader className="select-none">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
    </div>
  )
}
