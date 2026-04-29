import { useState, useCallback } from 'react';
import { useCustomers } from '../../hooks/useCustomers';
import { Search, Edit, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';

const PAGE_SIZES = [10, 25, 50];

export default function AdminCustomerPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounced search
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(1); // Reset to page 1 on search

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

  const { data, isLoading, error } = useCustomers({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const totalCustomers = data?.totalCustomers || 0;
  const customers = data?.data || [];

  // Define table columns
  const columns = [
    { key: 'id', label: 'ID', width: '200px' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
  ];

  // Custom cell renderer for formatted data
  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="text-sm font-mono text-slate-600 truncate">
            {row.id}
          </div>
        );
      case 'name':
        return (
          <div className="text-sm font-medium text-slate-900">
            {row.name}
          </div>
        );
      case 'email':
        return (
          <div className="text-sm text-slate-600">
            {row.email}
          </div>
        );
      case 'phoneNumber':
        return (
          <div className="text-sm text-slate-600">
            {row.phoneNumber || 'N/A'}
          </div>
        );
      default:
        return <div className="text-sm text-slate-900">{row[columnKey]}</div>;
    }
  };

  // Render action menu for each row
  const renderActions = (customer) => (
    <div className="py-1">
      <button
        onClick={() => handleEditCustomer(customer)}
        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      <button
        onClick={() => handleDeleteCustomer(customer)}
        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition border-t border-slate-200"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );

  // Action handlers
  const handleEditCustomer = (customer) => {
    console.log('Edit customer:', customer);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleDeleteCustomer = (customer) => {
    console.log('Delete customer:', customer);
    // TODO: Open delete confirmation modal
  };

  // Filter options UI
  const filterOptions = (
    <>
      {/* Search */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Page Size */}
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
      {/* Header */}
      <Header 
        title="Customers Management" 
        desc="Manage your customers" 
        buttonText="Add new Customer" 
        linkhref="/admin/customers/new"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Data Table */}
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading}
          error={error}
          pageSize={pageSize}
          page={page}
          totalItems={totalCustomers}
          onPageChange={setPage}
          renderCell={renderCell}
          renderActions={renderActions}
          filterOptions={filterOptions}
          title="Customers"
          emptyMessage="No customers found"
          emptySubMessage="Try adjusting your search criteria"
        />
      </main>
    </div>
  );
}