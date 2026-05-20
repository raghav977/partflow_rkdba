import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, User, Truck, FileText } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useCustomerVehicles } from '@/hooks/useVehicles';
import { useParts } from '@/hooks/useParts';

export default function SaleInvoiceForm({ onSubmit, isPending = false, initialData = null }) {
  const { data: customersData } = useCustomers({ pageSize: 1000 });
  const { data: vehiclesData } = useCustomerVehicles(null); // Will be set dynamically
  const { data: partsData } = useParts({ pageSize: 1000 });

  const customers = customersData?.data || [];
  const parts = partsData?.data || [];

  const [formData, setFormData] = useState(
    initialData || {
      customerId: '',
      vehicleId: '',
      saleItems: [],
      email: ''
    }
  );

  const [errors, setErrors] = useState({});
  const [customerVehicles, setCustomerVehicles] = useState([]);
  const [selectedPartData, setSelectedPartData] = useState({});

  // Fetch vehicles for selected customer
  const { data: fetchedVehicles } = useCustomerVehicles(formData.customerId || null);

  // Update available vehicles when customer changes
  useEffect(() => {
    if (fetchedVehicles && Array.isArray(fetchedVehicles)) {
      setCustomerVehicles(fetchedVehicles);
      // Reset vehicle if current one is no longer valid
      if (formData.vehicleId && !fetchedVehicles.some(v => v.id === formData.vehicleId)) {
        setFormData(prev => ({ ...prev, vehicleId: '' }));
      }
    } else if (!formData.customerId) {
      setCustomerVehicles([]);
    }
  }, [fetchedVehicles, formData.customerId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }

    if (!formData.saleItems || formData.saleItems.length === 0) {
      newErrors.saleItems = 'At least one item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setFormData(prev => ({
      ...prev,
      customerId,
      vehicleId: '' // Reset vehicle when customer changes
    }));
    if (errors.customerId) {
      setErrors(prev => ({ ...prev, customerId: '' }));
    }
  };

  const handleVehicleChange = (e) => {
    setFormData(prev => ({ ...prev, vehicleId: e.target.value }));
    if (errors.vehicleId) {
      setErrors(prev => ({ ...prev, vehicleId: '' }));
    }
  };

  const handleEmailChange = (e) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
  };

  const addItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      partId: '',
      quantity: 1,
      price: ''
    };
    setFormData(prev => ({
      ...prev,
      saleItems: [...prev.saleItems, newItem]
    }));
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      saleItems: prev.saleItems.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      saleItems: prev.saleItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));

    // Auto-fill price if part is selected
    if (field === 'partId' && value) {
      const selectedPart = parts.find(p => p.id === value);
      if (selectedPart) {
        setFormData(prev => ({
          ...prev,
          saleItems: prev.saleItems.map(item =>
            item.id === itemId ? { ...item, price: selectedPart.price } : item
          )
        }));
      }
    }
  };

  const calculateTotal = () => {
    return formData.saleItems.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const calculateDiscount = () => {
    const total = calculateTotal();
    return total > 5000 ? total * 0.10 : 0;
  };

  const total = calculateTotal();
  const discount = calculateDiscount();
  const finalAmount = total - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      customerId: formData.customerId,
      vehicleId: formData.vehicleId,
      saleItems: formData.saleItems
        .filter(item => item.partId && item.quantity && item.price)
        .map(item => ({
          partId: item.partId,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
      ...(formData.email && { email: formData.email })
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Select */}
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                id="customerId"
                value={formData.customerId}
                onChange={handleCustomerChange}
                disabled={isPending}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
              )}
            </div>

            {/* Vehicle Select */}
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Vehicle <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                id="vehicleId"
                value={formData.vehicleId}
                onChange={handleVehicleChange}
                disabled={isPending || customerVehicles.length === 0}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {customerVehicles.length === 0
                    ? 'Select a customer first'
                    : 'Select a vehicle'}
                </option>
                {customerVehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Email for Invoice (Optional)
                </div>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={isPending}
                placeholder="customer@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">Invoice will be sent to this email if provided</p>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Invoice Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              disabled={isPending || !formData.customerId || !formData.vehicleId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {errors.saleItems && (
            <p className="mb-4 text-sm text-red-600">{errors.saleItems}</p>
          )}

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Part</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Qty</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Price (Rs.)</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Total (Rs.)</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.saleItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center px-4 py-8 text-slate-500">
                      No items added yet. Click "Add Item" to start.
                    </td>
                  </tr>
                ) : (
                  formData.saleItems.map((item, index) => {
                    const itemTotal = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
                    return (
                      <tr key={item.id} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <select
                            value={item.partId}
                            onChange={(e) => updateItem(item.id, 'partId', e.target.value)}
                            disabled={isPending}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select part</option>
                            {parts.map(part => (
                              <option key={part.id} value={part.id}>
                                {part.name} (Stock: {part.stockQuantity})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            disabled={isPending}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                            disabled={isPending}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          Rs. {itemTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={isPending}
                            className="text-red-600 hover:text-red-700 disabled:text-slate-400 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-slate-50 rounded-lg p-6 space-y-3">
          <div className="flex justify-between items-center text-slate-700">
            <span>Subtotal:</span>
            <span className="font-medium">Rs. {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-green-700 bg-green-50 px-3 py-2 rounded">
            <span>Discount (10% if &gt; Rs. 5000):</span>
            <span className="font-medium">-Rs. {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-3 text-blue-600">
            <span>Final Total:</span>
            <span>Rs. {finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending || formData.saleItems.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            {isPending ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </form>
  );
}
