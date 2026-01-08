import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { useProductPriceModalStore } from '@/store';
import { useCreateProductPrice, useUpdateProductPrice } from '@/hooks';
import { productPriceCreateSchema, type CreateProductPriceInput } from '@/schemas';
import { DatePicker } from '@/components/ui/date-picker';
import { useParams } from 'react-router';

const ProductDetailsForm = () => {
  const { id } = useParams();
  const { isOpen, close, mode, editingItem } = useProductPriceModalStore();
  const createProductPrice = useCreateProductPrice();
  const updateProductPrice = useUpdateProductPrice();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<CreateProductPriceInput>({
    resolver: zodResolver(productPriceCreateSchema),
    defaultValues: {
      productId: '',
      price: 0,
      effectiveAt: new Date(),
    },
  });

  useEffect(() => {
    if (mode === 'edit') {
      reset({
        productId: editingItem?.productId,
        price: editingItem?.price ?? 0,
        effectiveAt: editingItem?.effectiveAt ?? new Date(),
      });
    } else {
      reset({ productId: id, price: 0, effectiveAt: new Date() });
    }
  }, [mode, editingItem, reset, id]);

  const onSubmit = async (data: CreateProductPriceInput) => {
    try {
      if (mode === 'add') {
        // const product = {...data, }
        await createProductPrice.mutateAsync(data);
      } else if (mode === 'edit' && editingItem) {
        await updateProductPrice.mutateAsync({ id: editingItem.id, data });
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
          <DialogTitle>{mode === 'add' ? 'Ajouter un prix' : 'Éditer un prix'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Prix unitaire</label>
            <Input type="number" min={0} step={25} {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Date Effective</label>
            <Controller
              control={control}
              name="effectiveAt"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ?? undefined)}
                />
              )}
            />
            {errors.effectiveAt && <p className="mt-1 text-sm text-red-600">{errors.effectiveAt.message}</p>}
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

export { ProductDetailsForm };
