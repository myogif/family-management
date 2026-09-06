'use client'

import { ReactNode } from 'react'

interface DataTableColumn<T> {
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  className?: string
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
  emptyAction?: ReactNode
  isLoading?: boolean
  skeletonRows?: number
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data found',
  emptyAction,
  isLoading = false,
  skeletonRows = 5,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(skeletonRows)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptyAction && <div className="mt-4">{emptyAction}</div>}
      </div>
    )
  }

  const renderCell = (item: T, column: DataTableColumn<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }
    return String(item[column.accessor] ?? '-')
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-left p-4 text-sm font-medium ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="border-t hover:bg-muted/50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`p-4 text-sm ${column.cellClassName || ''}`}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-start gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {column.header}
                </span>
                <span className={`text-sm text-right ${column.cellClassName || ''}`}>
                  {renderCell(item, column)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
