import { useNavigate } from 'react-router-dom';
import { useCreatePart } from '@/hooks/useParts';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import PartAddForm from '@/components/form/PartAddForm';

export default function AddPartPage() {
  const navigate = useNavigate();
  const createPartMutation = useCreatePart();

  const handleSubmit = async (formData) => {
    try {
      await createPartMutation.mutateAsync(formData);
      toast.success('Part created successfully');
      navigate('/admin/parts');
    } catch (error) {
      toast.error(error.message || 'Failed to create part');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="Add New Part"
        desc="Register a new spare part in the system"
        buttonText=""
        linkhref=""
      />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <PartAddForm
          onSubmit={handleSubmit}
          isPending={createPartMutation.isPending}
        />
      </main>
    </div>
  );
}
