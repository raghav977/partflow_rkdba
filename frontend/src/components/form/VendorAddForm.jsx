import { useState } from 'react';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

const VendorAddForm = ({ onSubmit, isPending, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phoneNumber: initialData?.phoneNumber || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phoneNumber && !/^[+\d\s\-()]*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Vendor Name *
            </div>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., ABC Auto Parts"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.name
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-blue-500'
            } bg-white`}
            disabled={isPending}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              Phone Number
            </div>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g., +977-1-1234567"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.phoneNumber
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-blue-500'
            } bg-white`}
            disabled={isPending}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              Email Address
            </div>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., contact@vendor.com"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.email
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-blue-500'
            } bg-white`}
            disabled={isPending}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Address
            </div>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., 123 Business Street, Kathmandu"
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.address
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-blue-500'
            } bg-white resize-none`}
            disabled={isPending}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Saving...' : 'Save Vendor'}
        </button>
        <p className="text-sm text-slate-500">* Required fields</p>
      </div>
    </form>
  );
};

export default VendorAddForm;