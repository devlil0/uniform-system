import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchPlaceholder?: string;
  globalFilter?: boolean;
}

export function DataTable<T>({ data, columns, searchPlaceholder = 'Buscar...', globalFilter = true }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState('');

  const table = useReactTable({
    data, columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {globalFilter && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} />
          <Input placeholder={searchPlaceholder} value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9" />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-soft)', background: '#fafafa' }}>
                {table.getHeaderGroups()[0]?.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className={cn('px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider', h.column.getCanSort() && 'cursor-pointer select-none')}
                    style={{ color: 'var(--text-faint)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getCanSort() && (
                        <span style={{ color: 'var(--text-faint)' }}>
                          {h.column.getIsSorted() === 'asc' ? <ChevronUp className="h-3 w-3" /> :
                           h.column.getIsSorted() === 'desc' ? <ChevronDown className="h-3 w-3" /> :
                           <ChevronsUpDown className="h-3 w-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length}><EmptyState /></td></tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#ffffff' : '#fafafb' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4.5" style={{ color: 'var(--text-main)' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="px-1 text-xs font-medium" style={{ color: 'var(--text-faint)' }}>
        {table.getFilteredRowModel().rows.length} registro(s)
      </p>
    </div>
  );
}
