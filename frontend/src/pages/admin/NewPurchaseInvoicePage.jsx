import { useState } from 'react';
import { Loader, AlertCircle, Plus, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import api from '@/lib/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NewPurchaseInvoicePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingParts, setLoadingParts] = useState(true);

  const [formData, setFormData] = useState({
    vendorId: '',
    items: [{ partId: '', quantity: 0, price: 0 }],
    notes: '',
    discount: 0
  });

  // Fetch vendors and parts on mount


  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendor?pageSize=100');
      if (response.data.success || response.data.data) {
        setVendors(response.data.data?.data || response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchParts = async () => {
    try {
      const response = await api.get('/part?pageSize=100');
      if (response.data.success || response.data.data) {
        setParts(response.data.data?.data || response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast.error('Failed to load parts');
    } finally {
      setLoadingParts(false);
    }
  };
    useEffect(() => {
    fetchVendors();
    fetchParts();
  }, []);

  const handleVendorChange = (e) => {
    setFormData({ ...formData, vendorId: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'partId' ? value : Number(value) || 0;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { partId: '', quantity: 0, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price || 0);
    }, 0);
    return subtotal - formData.discount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendorId) {
      toast.error('Please select a vendor');
      return;
    }

    if (formData.items.some(item => !item.partId || item.quantity <= 0 || item.price <= 0)) {
      toast.error('Please fill all item details');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        vendorId: formData.vendorId,
        PurchaseItems: formData.items.map(item => ({
          partId: item.partId,
          quantity: item.quantity,
          price: item.price
        })),
        discount: formData.discount,
        notes: formData.notes
      };

      console.log('Submitting purchase invoice with payload:', payload);

      const response = await api.post('/purchase', payload);
      
      if (response.data.success) {
        toast.success('Purchase invoice created successfully!');
        navigate('/admin/purchases');
      } else {
        toast.error(response.data.message || 'Failed to create purchase invoice');
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast.error(error.response?.data?.message || 'Failed to create purchase invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loadingVendors || loadingParts) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="New Purchase Invoice" desc="Create a new purchase order" buttonText="" />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="New Purchase Invoice" desc="Create a new purchase order" buttonText="" />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vendorId}
                  onChange={handleVendorChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select a vendor...</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      {/* Part */}
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Part</label>
                        <select
                          value={item.partId}
                          onChange={(e) => handleItemChange(index, 'partId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          required
                        >
                          <option value="">Select part...</option>
                          {parts.map(part => (
                            <option key={part.id} value={part.id}>
                              {part.name} ({part.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Price */}
                      <div className="w-28">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Total */}
                      <div className="w-28">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Total</label>
                        <div className="px-3 py-2 bg-slate-100 rounded-lg font-medium">
                          Rs. {(item.quantity * item.price).toLocaleString('en-NP')}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes about this purchase..."
                />
              </div>

              {/* Total Summary */}
              <div className="bg-slate-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-semibold">
                    Rs. {formData.items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0).toLocaleString('en-NP')}
                  </span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700">Discount:</span>
                    <span className="font-semibold text-orange-600">-Rs. {formData.discount.toLocaleString('en-NP')}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">Rs. {calculateTotal().toLocaleString('en-NP')}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/admin/purchases')}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  Create Purchase Invoice
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
