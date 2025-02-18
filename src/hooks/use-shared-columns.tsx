import clsx from "clsx"
import { ArrowUpDown, Ban, CheckCircle, MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog"
import { CopyText } from "@/components/custom/copy"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/format-date"
import { translateSring } from "@/lib/translate-string"
import type { DataTableFilterField } from "@/components/custom/data-table/data-table-faceted-filter"
import type { Projects, User, withdraw_actions } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"

type BaseEntity = {
  id: string
  name?: string
  email?: string
}

type UserType = BaseEntity & User

type Project = BaseEntity & Projects

type WithdrawAction = BaseEntity & withdraw_actions

type TableActions = {
  onDelete?: (id: string) => void
  onBlock?: (id: string) => void
  onUnblock?: (id: string) => void
  onActivate?: (id: string) => void
  onDeactivate?: (id: string) => void
  basePath: "/projects" | "/users" | "/operations" | "/profits-percentage"
}

type SharedColumnsProps = {
  entityType: "users" | "projects" | "withdraw_actions" | "profits_percentage"
  actions: TableActions
}

// Add Row type for better type safety
type Row<T> = {
  original: T
  getIsSelected: () => boolean
  toggleSelected: (value: boolean) => void
}

function getDeleteDialogTitle(
  entityType: string,
  entity: BaseEntity & {
    projectName?: string
  },
) {
  switch (entityType) {
    case "users":
      return `هل أنت متأكد من حذف المستخدم ${entity.name}؟`
    case "projects":
      return `هل أنت متأكد من حذف المشروع ${entity.projectName}؟`
    case "withdraw_actions":
      return `هل أنت متأكد من حذف العملية رقم ${entity.id}؟`
    case "profits_percentage":
      return `هل أنت متأكد من حذف نسبة الربح للمشروع ${entity.projectName}؟`
    default:
      return "هل أنت متأكد من حذف هذا العنصر؟"
  }
}

function ActionCell<T extends BaseEntity>({
  row,
  entityType,
  actions,
}: {
  row: Row<
    T & {
      accountStatus?: string
      projectStatus?: string
      projectName?: string
    }
  >
  entityType: string
  actions: TableActions
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const entity = row.original

  const handleDelete = async () => {
    setIsDeleting(true)
    actions.onDelete?.(entity.id)
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
            <span className="sr-only">إفتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="rtl">
          <DropdownMenuLabel className="sr-only">{translateSring("actions")}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin${actions.basePath}/${entity.id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              تعديل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {entityType === "users" && actions.onBlock && actions.onUnblock && (
            <DropdownMenuItem
              onClick={() =>
                (row.original as unknown as UserType).accountStatus === "block"
                  ? actions.onUnblock?.(entity.id)
                  : actions.onBlock?.(entity.id)
              }
            >
              <Ban className="mr-2 h-4 w-4" />
              {(row.original as unknown as UserType).accountStatus === "block"
                ? "الغاء حظر المستخدم"
                : "حظر المستخدم"}
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onActivate && actions.onDeactivate && (
            <DropdownMenuItem
              onClick={() =>
                (row.original as unknown as Project).projectStatus === "pending"
                  ? actions.onActivate?.(entity.id)
                  : actions.onDeactivate?.(entity.id)
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {(row.original as unknown as Project).projectStatus === "pending" ? "تفعيل" : "تعطيل"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={getDeleteDialogTitle(entityType, entity)}
        description="لا يمكن التراجع عن هذا الإجراء."
        buttonText={isDeleting ? "جاري الحذف..." : "حذف"}
        buttonClass="bg-destructive hover:bg-destructive/90"
        onConfirm={handleDelete}
      />
    </>
  )
}

export function useSharedColumns<T extends BaseEntity>({
  entityType,
  actions,
}: SharedColumnsProps): {
  columns: ColumnDef<T>[]
  filterFields: DataTableFilterField[]
} {
  const filterFields: DataTableFilterField[] = [
    ...(entityType === "users"
      ? [
          {
            id: "role",
            label: translateSring("role"),
            options: [
              { label: translateSring("admin"), value: "admin" },
              { label: translateSring("user"), value: "user" },
            ],
          },
          {
            id: "accountStatus",
            label: translateSring("status"),
            options: [
              { label: translateSring("active"), value: "active" },
              { label: translateSring("block"), value: "block" },
              { label: translateSring("pending"), value: "pending" },
            ],
          },
        ]
      : []),
    ...(entityType === "projects"
      ? [
          {
            id: "projectStatus",
            label: translateSring("projectStatus"),
            options: [
              {
                label: translateSring("Active".toLocaleLowerCase()),
                value: "active",
              },
              {
                label: translateSring("Pending".toLocaleLowerCase()),
                value: "pending",
              },
            ],
          },
        ]
      : []),
  ]

  const baseColumns: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const userColumns: ColumnDef<T>[] = [
    {
      accessorKey: "sn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("sn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return <span className="whitespace-nowrap">{user.sn}</span>
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return <span className="whitespace-nowrap">{user.name}</span>
      },
    },
    {
      accessorKey: "stocks",
      header: () => {
        return <span className="whitespace-nowrap">{translateSring("stocks")}</span>
      },
      cell: ({ row }) => {
        const userStocks = (row.original as unknown as UserType).stocks
        const totalStocks = userStocks.reduce((acc, stock) => acc + stock.stocks, 0)

        return <span>{totalStocks}</span>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("role")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": user.role === "admin",
              "bg-blue-50 text-blue-600": user.role === "user",
            })}
          >
            {translateSring(user.role)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as UserType).role
        return filterValues.includes(value)
      },
    },
    {
      accessorKey: "accountStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("status")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": user.accountStatus === "active",
              "bg-red-50 text-red-600": user.accountStatus === "block",
              "bg-yellow-50 text-yellow-600": user.accountStatus === "pending",
            })}
          >
            {translateSring(user.accountStatus)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as UserType).accountStatus
        return filterValues.includes(value)
      },
    },
  ]

  const projectColumns: ColumnDef<T>[] = [
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectName")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span className="whitespace-nowrap">{project.projectName}</span>
      },
    },
    {
      accessorKey: "projectStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStatus")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": project.projectStatus === "active",
              "bg-yellow-50 text-yellow-600": project.projectStatus === "pending",
            })}
          >
            {translateSring(project.projectStatus)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as Project).projectStatus
        return filterValues.includes(value)
      },
    },
    {
      accessorKey: "projectLocation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectLocation")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "projectAvailableStocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectAvailableStocks")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectAvailableStocks}</span>
      },
    },
    {
      accessorKey: "projectTotalStocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectTotalStocks")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectTotalStocks}</span>
      },
    },
    {
      accessorKey: "projectStockPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStockPrice")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectStockPrice}</span>
      },
    },
    {
      accessorKey: "projectSpecialPercentageCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentageCode")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return project.projectSpecialPercentageCode ? (
          <span>
            <CopyText
              text={project.projectSpecialPercentageCode ?? ""}
              className="ml-2 inline h-4 w-4"
            />
            {project.projectSpecialPercentageCode}
          </span>
        ) : (
          <Link href="/admin/profits-percentage">
            <Button variant={"pressable"} size={"sm"} className="text-xs">
              إضف نسبة زيادة ربح
            </Button>
          </Link>
        )
      },
    },
    {
      accessorKey: "projectSpecialPercentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentage")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return project.projectSpecialPercentage ? (
          <span>{project.projectSpecialPercentage}%</span>
        ) : (
          <Link href="/admin/profits-percentage">
            <Button variant={"pressable"} size={"sm"} className="text-xs">
              إضف نسبة زيادة ربح
            </Button>
          </Link>
        )
      },
    },
    {
      accessorKey: "projectStartDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStartDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectStartDate),
        }),
    },
    {
      accessorKey: "projectEndDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectEndDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectEndDate),
        }),
    },
    {
      accessorKey: "projectProfitsCollectDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectProfitsCollectDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectProfitsCollectDate),
        }),
    },
  ]

  const withdrawActionColumns: ColumnDef<T>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("id")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.id} className="ml-2 inline h-4 w-4" />
            {withdrawAction.id}
          </span>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "name">
        }
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.user.name} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.name}
          </span>
        )
      },
    },
    {
      accessorKey: "sn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("sn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "sn">
        }
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.user.sn.toString()} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.sn}
          </span>
        )
      },
    },
    {
      accessorKey: "withdraw_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("amount")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "accounting_operation_status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("status")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600":
                withdrawAction.accounting_operation_status === "completed",
              "bg-yellow-50 text-yellow-600":
                withdrawAction.accounting_operation_status === "pending",
              "bg-red-50 text-red-600": withdrawAction.accounting_operation_status === "rejected",
            })}
          >
            {translateSring(withdrawAction.accounting_operation_status)}
          </span>
        )
      },
    },
    {
      accessorKey: "action_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("type")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return <span>{translateSring(withdrawAction.action_type)}</span>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("phone")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "phone">
        }
        return (
          <Link
            href={`tel:${withdrawAction.user.phone}`}
            className="text-primary whitespace-nowrap"
          >
            {withdrawAction.user.phone}
          </Link>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "email">
        }
        return (
          <Link
            href={`mailto:${withdrawAction.user.email}`}
            className="text-primary whitespace-nowrap"
          >
            {withdrawAction.user.email}
          </Link>
        )
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("address")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "address">
        }
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.user.address} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.address}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("created_at")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as WithdrawAction).created_at),
        }),
    },
  ]

  const profitsPercentageColumns: ColumnDef<T>[] = [
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectName")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span className="whitespace-nowrap">{project.projectName}</span>
      },
    },
    {
      accessorKey: "projectSpecialPercentageCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentageCode")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return (
          <span>
            <CopyText
              text={project.projectSpecialPercentageCode ?? ""}
              className="ml-2 inline h-4 w-4"
            />
            {project.projectSpecialPercentageCode}
          </span>
        )
      },
    },
    {
      accessorKey: "projectSpecialPercentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentage")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectSpecialPercentage}%</span>
      },
    },
    {
      accessorKey: "projectStockProfits",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("currentProfits")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "newProfits",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("newProfits")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        const newProfits =
          project.projectStockProfits +
          (project.projectStockProfits * (project.projectSpecialPercentage ?? 0)) / 100
        return <span>{newProfits}</span>
      },
    },
  ]

  const actionsColumn: ColumnDef<T> = {
    id: "actions",
    header: translateSring("actions"),
    cell: ({ row }) => (
      <ActionCell<T> row={row as Row<T>} entityType={entityType} actions={actions} />
    ),
  }

  return {
    columns: [
      ...baseColumns,
      ...(entityType === "users"
        ? [...userColumns, actionsColumn]
        : entityType === "projects"
          ? [...projectColumns, actionsColumn]
          : entityType === "withdraw_actions"
            ? [...withdrawActionColumns, actionsColumn]
            : entityType === "profits_percentage"
              ? [...profitsPercentageColumns, actionsColumn]
              : []),
    ] as ColumnDef<T>[],
    filterFields,
  }
}
