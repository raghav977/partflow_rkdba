import { useNavigate } from 'react-router-dom';
import { useCreateVendor } from '@/hooks/useVendors';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import VendorAddForm from '@/components/form/VendorAddForm';

export default function AddVendorPage() {
  const navigate = useNavigate();
  const createVendorMutation = useCreateVendor();

  const handleSubmit = async (formData) => {
    try {
      await createVendorMutation.mutateAsync(formData);
      toast.success('Vendor created successfully');
      navigate('/admin/vendors');
    } catch (error) {
      toast.error(error.message || 'Failed to create vendor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Add New Vendor"
        desc="Register a new vendor in the system"
        buttonText=""
        linkhref=""
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <VendorAddForm
          onSubmit={handleSubmit}
          isPending={createVendorMutation.isPending}
        />
      </main>
    </div>
  );
}