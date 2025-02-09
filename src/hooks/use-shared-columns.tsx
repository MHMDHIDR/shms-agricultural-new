import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  CheckCircle,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { formatDate } from "@/lib/format-date";
import type { DataTableFilterField } from "@/components/custom/data-table/data-table-faceted-filter";
import { translateSring } from "@/lib/translate-string";

// Types
type DateTime = Date | string;

type BaseEntity = {
  id: string;
  name?: string;
  email?: string;
};

// Define specific interfaces based on schema
type User = BaseEntity & {
  role: "admin" | "user";
  emailVerified: DateTime | null;
  accountStatus: "active" | "block" | "pending";
};

type Project = BaseEntity & {
  projectName: string;
  projectStatus: "pending" | "active";
  projectLocation: string;
  projectStartDate: DateTime;
  projectEndDate: DateTime;
  projectDescription: string;
};

type WithdrawAction = BaseEntity & {
  withdraw_amount: number;
  accounting_operation_status: string;
  created_at: DateTime;
  message?: string;
};

// Define the actions that can be performed
type TableActions = {
  onDelete?: (id: string) => void;
  onBlock?: (id: string) => void;
  onUnblock?: (id: string) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  basePath: "/projects" | "/users" | "/withdraw-actions";
};

type SharedColumnsProps = {
  entityType: "users" | "projects" | "withdraw_actions";
  actions: TableActions;
};

export function useSharedColumns<T extends BaseEntity>({
  entityType,
  actions,
}: SharedColumnsProps): {
  columns: ColumnDef<T>[];
  filterFields: DataTableFilterField[];
} {
  const filterFields: DataTableFilterField[] = [
    ...(entityType === "users"
      ? [
          {
            id: "role",
            label: "Role",
            options: [
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
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
  ];

  const baseColumns: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
  ];

  const userColumns: ColumnDef<T>[] = [
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
        const user = row.original as unknown as User;
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": user.role === "admin",
              "bg-blue-50 text-blue-600": user.role === "user",
            })}
          >
            {translateSring(user.role)}
          </span>
        );
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
        const user = row.original as unknown as User;
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
        );
      },
    },
  ];

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
        const project = row.original as unknown as Project;
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": project.projectStatus === "active",
              "bg-yellow-50 text-yellow-600":
                project.projectStatus === "pending",
            })}
          >
            {translateSring(project.projectStatus)}
          </span>
        );
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
  ];

  const withdrawActionColumns: ColumnDef<T>[] = [
    {
      accessorKey: "withdraw_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
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
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction;
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600":
                withdrawAction.accounting_operation_status === "completed",
              "bg-yellow-50 text-yellow-600":
                withdrawAction.accounting_operation_status === "pending",
              "bg-red-50 text-red-600":
                withdrawAction.accounting_operation_status === "rejected",
            })}
          >
            {withdrawAction.accounting_operation_status}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as WithdrawAction).created_at),
        }),
    },
  ];

  const actionsColumn: ColumnDef<T> = {
    id: "actions",
    header: translateSring("actions"),
    cell: ({ row }) => {
      const entity = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">إفتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rtl">
            <DropdownMenuLabel className="sr-only">
              {translateSring("actions")}
            </DropdownMenuLabel>
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
                  (row.original as unknown as User).accountStatus === "block"
                    ? actions.onUnblock?.(entity.id)
                    : actions.onBlock?.(entity.id)
                }
              >
                <Ban className="mr-2 h-4 w-4" />
                {(row.original as unknown as User).accountStatus === "block"
                  ? "Unblock User"
                  : "Block User"}
              </DropdownMenuItem>
            )}
            {entityType === "projects" &&
              actions.onActivate &&
              actions.onDeactivate && (
                <DropdownMenuItem
                  onClick={() =>
                    (row.original as unknown as Project).projectStatus ===
                    "pending"
                      ? actions.onActivate?.(entity.id)
                      : actions.onDeactivate?.(entity.id)
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {(row.original as unknown as Project).projectStatus ===
                  "pending"
                    ? "تفعيل"
                    : "تعطيل"}
                </DropdownMenuItem>
              )}
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => actions.onDelete?.(entity.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  return {
    columns: [
      ...baseColumns,
      ...(entityType === "users"
        ? [...userColumns, actionsColumn]
        : entityType === "projects"
          ? [...projectColumns, actionsColumn]
          : entityType === "withdraw_actions"
            ? [...withdrawActionColumns, actionsColumn]
            : []),
    ] as ColumnDef<T>[],
    filterFields,
  };
}
