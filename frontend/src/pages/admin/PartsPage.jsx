import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParts, useDeletePart } from '@/hooks/useParts';
import { Search, Trash2, Edit2 } from 'lucide-react';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import { toast } from 'react-toastify';

const PAGE_SIZES = [10, 25, 50];

export default function PartsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const deletePartMutation = useDeletePart();

  // Debounced search
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1);

    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const { data, isLoading, error } = useParts({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const totalParts = data?.totalParts || 0;
  const parts = data?.data || [];

  // Define table columns
  const columns = [
    { key: 'name', label: 'Part Name' },
    { key: 'price', label: 'Price', width: '100px' },
    { key: 'stockQuantity', label: 'Stock', width: '80px' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'description', label: 'Description' },
  ];

  // Custom cell renderer
  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="text-sm font-medium text-slate-900">
            {row.name}
          </div>
        );
      case 'price':
        return (
          <div className="text-sm font-semibold text-green-600">
            Rs. {row.price.toFixed(2)}
          </div>
        );
      case 'stockQuantity':
        return (
          <div className={`text-sm font-medium ${
            row.stockQuantity > 10
              ? 'text-green-600'
              : row.stockQuantity > 0
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {row.stockQuantity}
          </div>
        );
      case 'vendorName':
        return (
          <div className="text-sm text-slate-700">
            {row.vendorName}
          </div>
        );
      case 'description':
        return (
          <div className="text-sm text-slate-600 max-w-xs truncate">
            {row.description || '-'}
          </div>
        );
      default:
        return <div className="text-sm text-slate-900">{row[columnKey]}</div>;
    }
  };

  // Render actions menu
  const renderActions = (part) => (
    <div className="py-1 space-y-1">
      <button
        onClick={() => handleEdit(part)}
        className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 flex items-center gap-2 transition"
      >
        <Edit2 className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={() => handleDelete(part.id)}
        disabled={deletePartMutation.isPending}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2 transition disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );

  const handleEdit = (part) => {
    navigate(`/admin/parts/edit/${part.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await deletePartMutation.mutateAsync(id);
        toast.success('Part deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Failed to delete part');
      }
    }
  };

  // Filter options
  const filterOptions = (
    <>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by part name or vendor..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Per Page
        </label>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Parts Management"
        desc="Manage your parts and inventory"
        buttonText="Add Part"
        linkhref="/admin/parts/new"
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={parts}
          isLoading={isLoading}
          error={error}
          pageSize={pageSize}
          page={page}
          totalItems={totalParts}
          onPageChange={setPage}
          renderCell={renderCell}
          renderActions={renderActions}
          filterOptions={filterOptions}
          title="Parts"
          emptyMessage="No parts found"
          emptySubMessage="Add a new part to get started"
        />
      </main>
    </div>
  );
}
