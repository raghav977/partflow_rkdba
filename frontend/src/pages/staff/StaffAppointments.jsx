import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import { useAppointmentsAdmin, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useState } from 'react';
import { toast } from 'react-toastify';

const STATUS_BADGES = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Confirmed: 'bg-green-100 text-green-800 border-green-200',
  Completed: 'bg-blue-100 text-blue-800 border-blue-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_VALUES = {
  Pending: 0,
  Confirmed: 1,
  Completed: 2,
  Cancelled: 3,
};

const StaffAppointments = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, error } = useAppointmentsAdmin({ page, pageSize });
  const updateStatus = useUpdateAppointmentStatus();

  const appointments = data?.data || [];
  const totalItems = data?.total || 0;

  const handleStatusUpdate = (id, status, label) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Appointment ${label} successfully`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update status');
        },
      }
    );
  };

  const columns = [
    { key: 'customerName', label: 'Customer' },
    { key: 'vehicleNumber', label: 'Vehicle No.' },
    { key: 'brandModel', label: 'Brand / Model' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' },
    { key: 'actions', label: 'Actions', width: '220px' },
  ];

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'customerName':
        return (
          <div className="text-sm font-medium text-slate-900">
            {row.customerName}
          </div>
        );
      case 'vehicleNumber':
        return (
          <div className="text-sm font-mono text-slate-700">
            {row.vehicleNumber}
          </div>
        );
      case 'brandModel':
        return (
          <div className="text-sm text-slate-700">
            {row.brand} {row.model}
          </div>
        );
      case 'appointmentDate':
        return (
          <div className="text-sm text-slate-700">
            {new Date(row.appointmentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        );
      case 'status':
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              STATUS_BADGES[row.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.status}
          </span>
        );
      case 'notes':
        return (
          <div className="text-sm text-slate-500 max-w-[200px] truncate" title={row.notes || ''}>
            {row.notes || '—'}
          </div>
        );
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            {row.status === 'Pending' && (
              <button
                onClick={() => handleStatusUpdate(row.id, STATUS_VALUES.Confirmed, 'confirmed')}
                disabled={updateStatus.isPending}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Confirm
              </button>
            )}
            {row.status === 'Confirmed' && (
              <button
                onClick={() => handleStatusUpdate(row.id, STATUS_VALUES.Completed, 'completed')}
                disabled={updateStatus.isPending}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Complete
              </button>
            )}
            {(row.status === 'Pending' || row.status === 'Confirmed') && (
              <button
                onClick={() => handleStatusUpdate(row.id, STATUS_VALUES.Cancelled, 'cancelled')}
                disabled={updateStatus.isPending}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>
            )}
            {(row.status === 'Completed' || row.status === 'Cancelled') && (
              <span className="text-xs text-slate-400 italic">No actions</span>
            )}
          </div>
        );
      default:
        return <div className="text-sm text-slate-900">{row[columnKey]}</div>;
    }
  };

  return (
    <div>
      <Header
        title="Appointment Management"
        desc="View and manage all customer appointments"
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DataTable
          columns={columns}
          data={appointments}
          isLoading={isLoading}
          error={error}
          pageSize={pageSize}
          page={page}
          totalItems={totalItems}
          onPageChange={setPage}
          renderCell={renderCell}
          showActions={false}
          title="Appointments"
          emptyMessage="No appointments found"
          emptySubMessage="Appointments will appear here when customers book them"
        />
      </main>
    </div>
  );
};

export default StaffAppointments;
