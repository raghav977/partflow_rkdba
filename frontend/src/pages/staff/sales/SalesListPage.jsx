import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSales } from '@/hooks/useSales';
import { Plus, Eye, Search } from 'lucide-react';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import useDebounce from '@/hooks/useDebounce';


export default function SalesListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: salesData, isLoading } = useSales({
    page,
    pageSize,
    search: debouncedSearch
  });

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'vehicleNumber', label: 'Vehicle' },
    { key: 'totalAmount', label: 'Total' },
    { key: 'discount', label: 'Discount' },
    { key: 'finalAmount', label: 'Final Amount' },
    { key: 'createdAt', label: 'Date' }
  ];

  const renderCell = (key, value, row) => {
    switch (key) {
      case 'totalAmount':
      case 'discount':
      case 'finalAmount':
        return `Rs. ${parseFloat(value || 0).toFixed(2)}`;
      case 'createdAt':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  };

  const renderActions = (row) => (
    <button
      onClick={() => navigate(`/staff/sales/${row.id}`)}
      className="inline-flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
      title="View details"
    >
      <Eye className="w-4 h-4" />
      View
    </button>
  );

  const filterOptions = (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer or vehicle..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(parseInt(e.target.value));
          setPage(1);
        }}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={10}>10 per page</option>
        <option value={25}>25 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Sales Invoices"
        desc="View and manage all sales invoices"
        buttonText="Create Invoice"
        linkhref="/staff/sales/new"
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={salesData?.data || []}
          isLoading={isLoading}
          renderCell={renderCell}
          renderActions={renderActions}
          filterOptions={filterOptions}
          pagination={{
            page,
            pageSize,
            totalItems: salesData?.totalSales || 0,
            onPageChange: setPage,
            onPageSizeChange: (size) => {
              setPageSize(size);
              setPage(1);
            }
          }}
        />
      </main>
    </div>
  );
}
