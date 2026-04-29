import { useCustomerDetails } from '@/hooks/useCustomers';
import { X, Loader, Mail, Phone, MapPin, Car, CheckCircle, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerDetailsModal({ customerId, isOpen, onClose }) {
  const { data: customer, isLoading, error } = useCustomerDetails(customerId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-end sm:items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="sticky top-0 right-0 float-right p-4 text-slate-400 hover:text-slate-600 bg-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-slate-600">Loading customer details...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-6 text-center">
              <p className="text-red-600">Failed to load customer details</p>
            </div>
          )}

          {/* Content */}
          {customer && (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
                <p className="text-slate-600">Customer ID: {customer.id}</p>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{customer.email}</span>
                  </div>
                  {customer.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{customer.phoneNumber}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                      <span className="text-slate-700">{customer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicles ({customer.vehicles?.length || 0})
                </h3>
                {customer.vehicles && customer.vehicles.length > 0 ? (
                  <div className="space-y-2">
                    {customer.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {vehicle.brand} {vehicle.model}
                            </p>
                            <p className="text-sm text-slate-600">
                              {vehicle.vehicleNumber} • {vehicle.year} • {vehicle.fuelType}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {vehicle.color} • {vehicle.mileageKm}km
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              vehicle.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No vehicles registered</p>
                )}
              </div>

              {/* Appointments */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Appointments ({customer.appointments?.length || 0})
                </h3>
                {customer.appointments && customer.appointments.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customer.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {appointment.vehicleNumber}
                            </p>
                            <p className="text-sm text-slate-600">
                              {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy HH:mm')}
                            </p>
                            {appointment.notes && (
                              <p className="text-xs text-slate-500 mt-1">{appointment.notes}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                              appointment.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No appointments</p>
                )}
              </div>

              {/* Part Requests */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Part Requests ({customer.partRequests?.length || 0})
                </h3>
                {customer.partRequests && customer.partRequests.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customer.partRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{request.partName}</p>
                            {request.description && (
                              <p className="text-sm text-slate-600">{request.description}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                              request.status === 'Approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No part requests</p>
                )}
              </div>

              {/* Member Since */}
              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <p className="text-slate-700">
                  Member since{' '}
                  <span className="font-semibold">
                    {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
