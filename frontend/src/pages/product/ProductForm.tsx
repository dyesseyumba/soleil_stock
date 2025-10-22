import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProductModalStore } from '@/store';
import { productCreateSchema, type CreateProductInput } from '@/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProduct, useUpdateProduct } from '@/hooks';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';

const ProductForm = () => {
  const { isOpen, close, mode, editingProduct } = useProductModalStore();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && editingProduct) {
      reset({
        name: editingProduct.name ?? '',
        description: editingProduct.description ?? '',
      });
    } else {
      reset({ name: '', description: '' });
    }
  }, [mode, editingProduct, reset]);

  const onSubmit = async (data: CreateProductInput) => {
    try {
      const payload = {
        ...data,
        description: data.description ?? undefined,
      };

      if (mode === 'add') {
        await createProduct.mutateAsync(payload);
      } else if (mode === 'edit' && editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, product: payload });
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
          <DialogTitle>{mode === 'add' ? 'Add Product' : 'Edit Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom du produit</label>
            <Input {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
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

export { ProductForm };
