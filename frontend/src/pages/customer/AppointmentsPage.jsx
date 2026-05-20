import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Loader, AlertCircle } from 'lucide-react';
import { useAppointments, useCreateAppointment } from '@/hooks/useCustomerModules';
import { useUserVehicles } from '@/hooks/useVehicles';
import { toast } from 'react-toastify';
import Header from '@/components/Header';

export default function AppointmentsPage() {
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAppointments();
  const { data: vehiclesData } = useUserVehicles();
  console.log("Appointments Data:", appointmentsData); // Debug log
  console.log("Vehicles Data:", vehiclesData); // Debug log
  const createMutation = useCreateAppointment();

  const [formData, setFormData] = useState({
    vehicleId: '',
    appointmentDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const appointments = appointmentsData?.data || [];
//   const vehicles = vehiclesData?.data || [];
const vehicles = vehiclesData || [];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
    
    const selectedDate = new Date(formData.appointmentDate);
    if (selectedDate < new Date()) {
      newErrors.appointmentDate = 'Appointment date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync(formData);
      setFormData({ vehicleId: '', appointmentDate: '', notes: '' });
      toast.success('Appointment booked successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Book Service Appointment"
        desc="Schedule a service appointment for your vehicle"
        buttonText=""
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                New Appointment
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vehicle <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => {
                      setFormData({ ...formData, vehicleId: e.target.value });
                      setErrors({ ...errors, vehicleId: '' });
                    }}
                    disabled={createMutation.isPending || vehicles.length === 0}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                  >
                    <option value="">
                      {vehicles.length === 0 ? 'No vehicles registered' : 'Select vehicle'}
                    </option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.vehicleNumber})
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.vehicleId}
                    </p>
                  )}
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) => {
                      setFormData({ ...formData, appointmentDate: e.target.value });
                      setErrors({ ...errors, appointmentDate: '' });
                    }}
                    disabled={createMutation.isPending}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                  />
                  {errors.appointmentDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.appointmentDate}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={createMutation.isPending}
                    placeholder="Describe the issue or service needed..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 resize-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.notes.length}/500
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createMutation.isPending || vehicles.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Book Appointment
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Your Appointments
              </h2>

              {appointmentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments booked yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {appointment.brand} {appointment.model}
                          </h3>
                          <p className="text-sm text-slate-600">{appointment.vehicleNumber}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(appointment.appointmentDate).toLocaleDateString()} {new Date(appointment.appointmentDate).toLocaleTimeString()}
                        </span>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded mt-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
