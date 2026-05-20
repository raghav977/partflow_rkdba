import { useParams, useNavigate } from 'react-router-dom';
import { useGetPartById, useUpdatePart } from '@/hooks/useParts';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import PartAddForm from '@/components/form/PartAddForm';
import { useEffect } from 'react';

export default function EditPartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: partData, isLoading, error } = useGetPartById(id);
  const updatePartMutation = useUpdatePart();

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to load part');
      navigate('/admin/parts');
    }
  }, [error, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await updatePartMutation.mutateAsync({
        id,
        data: formData,
      });
      toast.success('Part updated successfully');
      navigate('/admin/parts');
    } catch (error) {
      toast.error(error.message || 'Failed to update part');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          title="Edit Part"
          desc="Update spare part information"
          buttonText=""
          linkhref=""
        />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading part details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!partData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          title="Edit Part"
          desc="Update spare part information"
          buttonText=""
          linkhref=""
        />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-600">Part not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Edit Part"
        desc={`Update: ${partData.name}`}
        buttonText=""
        linkhref=""
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <PartAddForm
          initialData={{
            name: partData.name,
            description: partData.description || '',
            price: partData.price.toString(),
            stockQuantity: partData.stockQuantity.toString(),
            vendorId: partData.vendorId,
          }}
          onSubmit={handleSubmit}
          isPending={updatePartMutation.isPending}
        />
      </main>
    </div>
  );
}
