import { useState, useCallback } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { Search, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';

const PAGE_SIZES = [10, 25, 50];

export default function VehicleListPage() {
  const navigate = useNavigate();
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

  const { data, isLoading, error } = useVehicles({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const totalVehicles = data?.totalVehicles || 0;
  const vehicles = data?.data || [];

  // Define table columns
  const columns = [
    { key: 'vehicleNumber', label: 'Vehicle #', width: '120px' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerPhone', label: 'Phone' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'status', label: 'Status' },
  ];

  // Custom cell renderer for formatted data
  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'vehicleNumber':
        return (
          <div className="text-sm font-mono font-semibold text-blue-600">
            {row.vehicleNumber}
          </div>
        );
      case 'customerName':
        return (
          <div className="text-sm font-medium text-slate-900">
            {row.customerName}
          </div>
        );
      case 'customerPhone':
        return (
          <div className="text-sm text-slate-600">
            {row.customerPhone || 'N/A'}
          </div>
        );
      case 'brand':
        return (
          <div className="text-sm text-slate-700">
            {row.brand || '-'}
          </div>
        );
      case 'model':
        return (
          <div className="text-sm text-slate-700">
            {row.model || '-'}
          </div>
        );
      case 'status':
        return (
          <span
            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
              row.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : row.status === 'InActive'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {row.status}
          </span>
        );
      default:
        return <div className="text-sm text-slate-900">{row[columnKey]}</div>;
    }
  };

  // Render actions menu for each row
  const renderActions = (vehicle) => (
    <div className="py-1">
      <button
        onClick={() => handleViewCustomer(vehicle)}
        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
      >
        <Truck className="w-4 h-4" />
        View Customer
      </button>
    </div>
  );

  // Action handlers
  const handleViewCustomer = (vehicle) => {
    // Navigate to customer detail page
    navigate(`/staff/customers/${vehicle.customerId}`);
  };

  // Filter options UI
  const filterOptions = (
    <>
      {/* Search */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search Vehicles
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vehicle #, engine #, or chassis #..."
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
        title="Vehicle Management" 
        desc="Search vehicles and manage owner details" 
        buttonText="Add Vehicle" 
        linkhref="/staff/customers/new"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Data Table */}
        <DataTable
          columns={columns}
          data={vehicles}
          isLoading={isLoading}
          error={error}
          pageSize={pageSize}
          page={page}
          totalItems={totalVehicles}
          onPageChange={setPage}
          renderCell={renderCell}
          renderActions={renderActions}
          filterOptions={filterOptions}
          title="Vehicles"
          emptyMessage="No vehicles found"
          emptySubMessage="Try adjusting your search criteria"
        />
      </main>
    </div>
  );
}
