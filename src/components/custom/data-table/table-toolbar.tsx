import {
  DataTableFacetedFilter,
  type DataTableFilterField,
} from "@/components/custom/data-table/data-table-faceted-filter";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { translateSring } from "@/lib/translate-string";
import type { Table } from "@tanstack/react-table";
import { ChevronDown, SettingsIcon, X } from "lucide-react";
import { useMemo } from "react";

export type BulkAction = {
  label: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
};

type TableToolbarProps<TData> = {
  table: Table<TData>;
  filtering: string;
  setFiltering: (value: string) => void;
  selectedRows: TData[];
  bulkActions?: BulkAction[];
  searchPlaceholder?: string;
  filterFields?: DataTableFilterField[];
};

export function TableToolbar<TData>({
  table,
  filtering,
  setFiltering,
  selectedRows,
  bulkActions = [],
  searchPlaceholder = "Search...",
  filterFields = [],
}: TableToolbarProps<TData>) {
  const hasBulkActions = bulkActions.length > 0;

  const isFiltered = table.getState().columnFilters.length > 0;

  const { filterableColumns } = useMemo(() => {
    return { filterableColumns: filterFields.filter((field) => field.options) };
  }, [filterFields]);

  return (
    <div className="flex w-full flex-col gap-2 py-2.5 sm:flex-row">
      <Input
        placeholder={searchPlaceholder || "إبحث عن بيانات ..."}
        value={filtering}
        onChange={(event) => setFiltering(event.target.value)}
        className="rtl w-full sm:max-w-md"
      />
      <div className="flex flex-wrap items-center gap-2">
        {selectedRows.length > 0 && hasBulkActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                إجراءات إضافية
                <SettingsIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-1">
              <DropdownMenuLabel className="text-center">
                إجراءات إضافية
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {bulkActions.map((action, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Button
                    className="w-full cursor-pointer"
                    variant={action.variant ?? "default"}
                    size="sm"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {filterableColumns.map(
          (column) =>
            table.getColumn(column.id) && (
              <DataTableFacetedFilter
                key={column.id}
                column={table.getColumn(column.id)}
                title={column.label}
                options={column.options ?? []}
              />
            ),
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 cursor-pointer px-2 lg:px-3"
          >
            إلغاء الفلترة
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto cursor-pointer">
              <ChevronDown className="mr-2 h-4 w-4" />
              الأعمدة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  dir="auto"
                >
                  {translateSring(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
