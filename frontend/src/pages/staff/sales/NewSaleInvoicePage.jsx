import { useNavigate } from 'react-router-dom';
import { useCreateSaleInvoice } from '@/hooks/useSales';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import SaleInvoiceForm from '@/components/form/SaleInvoiceForm';

export default function NewSaleInvoicePage() {
  const navigate = useNavigate();
  const createSaleMutation = useCreateSaleInvoice();

  const handleSubmit = async (formData) => {
    try {
      await createSaleMutation.mutateAsync(formData);
      toast.success('Invoice created successfully!');
      navigate('/staff/sales');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Create New Invoice"
        desc="Generate a new sales invoice for a customer"
        buttonText=""
        linkhref=""
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <SaleInvoiceForm
          onSubmit={handleSubmit}
          isPending={createSaleMutation.isPending}
        />
      </main>
    </div>
  );
}
