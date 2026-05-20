import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useState } from 'react';

/**
 * Reusable DataTable Component - Fully Generic
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions: { key, label, width?, className? }
 * @param {Array} props.data - Array of data rows
 * @param {boolean} props.isLoading - Loading state
 * @param {Error} props.error - Error object if any
 * @param {number} props.pageSize - Number of rows per page
 * @param {number} props.page - Current page number
 * @param {number} props.totalItems - Total number of items
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} props.renderCell - Function to render cell content: (row, columnKey) => ReactNode
 * @param {Array} props.filterOptions - Optional filter UI controls
 * @param {string} props.title - Table title
 * @param {string} props.emptyMessage - Empty state message
 * @param {string} props.emptySubMessage - Empty state sub-message
 * @param {Function} props.renderActions - Function to render action menu: (row) => ReactNode
 * @param {boolean} props.showActions - Whether to show actions column (default: true)
 */
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  pageSize = 10,
  page = 1,
  totalItems = 0,
  onPageChange = () => {},
  renderCell = null,
  filterOptions = null,
  title = 'Data Table',
  emptyMessage = 'No data found',
  emptySubMessage = 'Try adjusting your search or filter criteria',
  renderActions = null,
  showActions = true,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const isLastPage = page === totalPages;
  const isFirstPage = page === 1;
  const [openRowId, setOpenRowId] = useState(null);

  return (
    <div className="w-full">
      {/* Filters */}
      {filterOptions && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filterOptions}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider ${
                      column.className || ''
                    }`}
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.label}
                  </th>
                ))}
                {showActions && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                // Loading State - Skeleton Rows
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-6 py-4 text-center">
                        <div className="h-4 bg-slate-200 rounded w-8 mx-auto"></div>
                      </td>
                    )}
                  </tr>
                ))
              ) : error ? (
                // Error State
                <tr>
                  <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-8 text-center">
                    <div className="text-red-600 font-medium">
                      Error: {error.message || 'Failed to load data'}
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-6 py-8 text-center">
                    <div className="text-slate-500">
                      <p className="font-medium">{emptyMessage}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {emptySubMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50 transition relative">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4">
                        {renderCell ? (
                          renderCell(row, column.key)
                        ) : (
                          <div className="text-sm text-slate-900">
                            {row[column.key]}
                          </div>
                        )}
                      </td>
                    ))}
                    
                    {/* Actions Column */}
                    {showActions && (
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={() => setOpenRowId(openRowId === rowIdx ? null : rowIdx)}
                          className="inline-flex items-center justify-center w-8 h-8 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Action Menu */}
                        {openRowId === rowIdx && renderActions && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                            {renderActions(row)}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing{' '}
            <span className="font-medium">
              {(page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(page * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> items
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={isFirstPage || isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                let pageNum = idx + 1;
                if (totalPages > 5) {
                  if (page > 3) {
                    pageNum = page - 2 + idx;
                  }
                }
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={isLastPage || isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
