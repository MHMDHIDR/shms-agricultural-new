import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  selectedRows: TData[];
  isSelectable?: boolean;
}

export function TablePagination<TData>({
  table,
  selectedRows,
  isSelectable = true,
}: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end gap-x-2 py-4">
      {isSelectable && (
        <div className="text-muted-foreground text-sm">
          تم تحديد {selectedRows.length} من{" "}
          {table.getFilteredRowModel().rows.length}
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        السابق
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        التالي
      </Button>
    </div>
  );
}
