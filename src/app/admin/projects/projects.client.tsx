"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
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
import type { Projects } from "@prisma/client"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"

export default function ProjectsClientPage({
  projects,
  count,
}: {
  projects: Projects[]
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

  const handleDeleteSingleProject = api.projects.deleteById.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المشروع")
    },
    onMutate: () => {
      toast.loading("جاري حذف المشروع ...")
    },
  })

  const handleDeleteManyProjects = api.projects.deleteManyById.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المشاريع المحددة بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المشاريع")
    },
    onMutate: () => {
      toast.loading("جاري حذف المشاريع ...")
    },
  })

  const handleActivateSingleProject = api.projects.update.useMutation({
    onSuccess: () => {
      toast.success("تم تفعيل المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تفعيل المشروع")
    },
    onMutate: () => {
      toast.loading("جاري تفعيل المشروع ...")
    },
  })

  const handleDeactivateSingleProject = api.projects.update.useMutation({
    onSuccess: () => {
      toast.success("تم تعطيل المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تعطيل المشروع")
    },
    onMutate: () => {
      toast.loading("جاري تعطيل المشروع ...")
    },
  })

  // Handle project actions
  const handleDeleteProject = (id: string) => {
    void handleDeleteSingleProject.mutate({ id })
  }

  const handleActivateProject = (id: string) => {
    void handleActivateSingleProject.mutate({ id, projectStatus: "active" })
  }

  const handleDeactivateProject = (id: string) => {
    void handleDeactivateSingleProject.mutate({ id, projectStatus: "pending" })
  }

  const { columns, filterFields } = useSharedColumns<Projects>({
    entityType: "projects",
    actions: {
      onDelete: handleDeleteProject,
      onActivate: handleActivateProject,
      onDeactivate: handleDeactivateProject,
      basePath: "/projects",
    },
  })

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

  // Define bulk actions
  const getBulkActions = (): BulkAction[] => {
    const actions: BulkAction[] = [
      {
        label: "حذف المحدد",
        onClick: () => {
          const ids = selectedRows.map(row => row.id)
          void handleDeleteManyProjects.mutate({ ids })
        },
        variant: "destructive",
      },
    ]

    if (selectedRows.length > 0) {
      const hasPendingProjects = selectedRows.some(row => row.projectStatus === "pending")
      const hasActiveProjects = selectedRows.some(row => row.projectStatus === "active")

      if (hasPendingProjects) {
        actions.push({
          label: "تفعيل المحدد",
          onClick: () => {
            const ids = selectedRows.map(row => row.id)
            toast.success(`Selected IDs: ${ids.join(", ")}`)
          },
          variant: "success",
        })
      }

      if (hasActiveProjects) {
        actions.push({
          label: "تعطيل المحدد",
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

  return !projects || count === 0 ? (
    <NoRecords
      msg="لم يتم العثور على أي مشاريع استثمارية في الوقت الحالي"
      links={[{ to: "/admin/projects/new", label: "إضافة مشروع جديد" }]}
    />
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Link href="/admin/projects/new">
          <Button variant={"pressable"}>مشروع جديد</Button>
        </Link>
      </div>

      <TableToolbar<Projects>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مشروع"
        bulkActions={getBulkActions()}
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
