import DataTable from '@/components/DataTable';
import Header from '@/components/Header'
import { useCustomers } from '@/hooks/useCustomers';
import { Search, Eye, Plus } from 'lucide-react';
import React, { useCallback } from 'react'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import CustomerDetailsModal from '@/components/CustomerDetailsModal';

const StaffCustomer = () => {
  const PAGE_SIZES = [10, 25, 50];
  const navigate = useNavigate();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounced search handler
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
        onClick={() => handleViewDetails(customer)}
        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
      >
        <Eye className="w-4 h-4" />
        View Details
      </button>
      <button
        onClick={() => handleAddVehicle(customer)}
        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition border-t border-slate-200"
      >
        <Plus className="w-4 h-4" />
        Add Vehicle
      </button>
    </div>
  );

  // Action handlers
  const handleViewDetails = (customer) => {
    setSelectedCustomerId(customer.id);
    setIsModalOpen(true);
  };

  const handleAddVehicle = (customer) => {
    
    console.log('Add vehicle for:', customer);
    navigate(`/staff/customers/${customer.id}/add-vehicle`);
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
    <div>
      <Header title="Customer management" desc="Manage your customers here" buttonText='Add Customer' linkhref="/staff/customers/new"/>
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

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomerId(null);
        }}
      />
    </div>
  )
}

export default StaffCustomer