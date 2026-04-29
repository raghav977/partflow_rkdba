import { useState } from 'react';
import { Package, DollarSign, Package2, Building2, FileText } from 'lucide-react';
import { useAllVendors } from '@/hooks/useVendors';

export default function PartAddForm({ onSubmit, isPending = false, initialData = null }) {
  const { data: vendorsData } = useAllVendors();
  const vendors = vendorsData?.data || [];

  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      vendorId: '',
    }
  );

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Part name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Part name must not exceed 100 characters';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0.01) {
      newErrors.price = 'Price must be greater than 0';
    } else if (parseFloat(formData.price) > 1000000) {
      newErrors.price = 'Price must not exceed 1,000,000';
    }

    // Stock quantity validation
    if (formData.stockQuantity === '') {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (!Number.isInteger(Number(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a positive integer';
    } else if (parseInt(formData.stockQuantity) > 1000000) {
      newErrors.stockQuantity = 'Stock quantity must not exceed 1,000,000';
    }

    // Vendor ID validation
    if (!formData.vendorId) {
      newErrors.vendorId = 'Please select a vendor';
    }

    // Description validation (optional but has max length)
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      vendorId: formData.vendorId,
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Part Name <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isPending}
            placeholder="Enter part name"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Vendor */}
        <div>
          <label htmlFor="vendorId" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Vendor <span className="text-red-500">*</span>
            </div>
          </label>
          <select
            id="vendorId"
            name="vendorId"
            value={formData.vendorId}
            onChange={handleChange}
            disabled={isPending || vendors.length === 0}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
          {errors.vendorId && (
            <p className="mt-1 text-sm text-red-600">{errors.vendorId}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price (Rs.) <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={isPending}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <Package2 className="w-4 h-4" />
              Stock Quantity <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            disabled={isPending}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          {errors.stockQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </div>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isPending}
            placeholder="Enter part description (optional)"
            rows="4"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            {formData.description?.length || 0}/500 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Part'}
        </button>
      </div>
    </form>
  );
}
