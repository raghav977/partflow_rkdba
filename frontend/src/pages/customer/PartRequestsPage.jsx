import { useState } from 'react';
import { Package, Plus, Loader, AlertCircle } from 'lucide-react';
import { usePartRequests, useCreatePartRequest } from '@/hooks/useCustomerModules';
import { toast } from 'react-toastify';
import Header from '@/components/Header';

export default function PartRequestsPage() {
  const { data: requestsData, isLoading: requestsLoading } = usePartRequests();
  const createMutation = useCreatePartRequest();

  const [formData, setFormData] = useState({
    partName: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const requests = requestsData?.data || [];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partName.trim()) {
      newErrors.partName = 'Part name is required';
    }
    if (formData.partName.length > 100) {
      newErrors.partName = 'Part name cannot exceed 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createMutation.mutateAsync(formData);
      setFormData({ partName: '', description: '' });
      toast.success('Part request submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Request Parts"
        desc="Request unavailable parts for your vehicle service"
        buttonText=""
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                New Request
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Part Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.partName}
                    onChange={(e) => {
                      setFormData({ ...formData, partName: e.target.value });
                      setErrors({ ...errors, partName: '' });
                    }}
                    disabled={createMutation.isPending}
                    placeholder="e.g., Brake Pads, Battery..."
                    maxLength={100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50"
                  />
                  {errors.partName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.partName}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.partName.length}/100
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={createMutation.isPending}
                    placeholder="Provide details about the part needed..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-50 resize-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {formData.description.length}/500
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Requests List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Your Requests
              </h2>

              {requestsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No part requests submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map(request => (
                    <div key={request.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{request.partName}</h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>

                      {request.description && (
                        <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded mt-2">
                          {request.description}
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
