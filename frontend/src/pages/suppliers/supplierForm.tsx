import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupplierModalStore } from '@/store';
import { supplierCreateSchema, type CreateSupplierInput } from '@/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';

const SupplierForm = () => {
  const { isOpen, close, mode, editingItem } = useSupplierModalStore();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSupplierInput>({
    resolver: zodResolver(supplierCreateSchema),
    defaultValues: {
      name: '',
      contactInfo: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      reset({
        name: editingItem.name ?? '',
        contactInfo: editingItem.contactInfo ?? '',
      });
    } else {
      reset({ name: '', contactInfo: '' });
    }
  }, [mode, editingItem, reset]);

  const onSubmit = async (data: CreateSupplierInput) => {
    try {
      if (mode === 'add') {
        await createSupplier.mutateAsync(data);
      } else if (mode === 'edit' && editingItem) {
        await updateSupplier.mutateAsync({ id: editingItem.id, data });
      }

      reset();
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Supplier' : 'Edit Supplier'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du fournisseurs</label>
            <Input {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Contact</label>
            <Input {...register('contactInfo')} />
            {errors.contactInfo && <p className="mt-1 text-sm text-red-600">{errors.contactInfo.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                reset();
                close();
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>
                  <Spinner /> Enregistrement...
                </span>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export { SupplierForm };
