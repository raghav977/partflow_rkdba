import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorById, useUpdateVendor } from '@/hooks/useVendors';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import VendorAddForm from '@/components/form/VendorAddForm';
import { useEffect } from 'react';

export default function EditVendorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: vendorData, isLoading, error } = useGetVendorById(id);
  const updateVendorMutation = useUpdateVendor();

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to load vendor');
      navigate('/admin/vendors');
    }
  }, [error, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await updateVendorMutation.mutateAsync({
        id,
        data: formData,
      });
      toast.success('Vendor updated successfully');
      navigate('/admin/vendors');
    } catch (error) {
      toast.error(error.message || 'Failed to update vendor');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          title="Edit Vendor"
          desc="Update vendor information"
          buttonText=""
          linkhref=""
        />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading vendor details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          title="Edit Vendor"
          desc="Update vendor information"
          buttonText=""
          linkhref=""
        />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Vendor not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Edit Vendor"
        desc={`Update: ${vendorData.name}`}
        buttonText=""
        linkhref=""
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <VendorAddForm
          initialData={{
            name: vendorData.name,
            phoneNumber: vendorData.phoneNumber || '',
            email: vendorData.email || '',
            address: vendorData.address || '',
          }}
          onSubmit={handleSubmit}
          isPending={updateVendorMutation.isPending}
        />
      </main>
    </div>
  );
}
