import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useSaleModalStore } from '@/store';

import { useCreateSale, useUpdateSale, useProducts, useProductPrices } from '@/hooks';
import { saleCreateSchema, type CreateSaleInput } from '@/schemas';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';

const SaleForm = () => {
  const { isOpen, close, mode, editingItem } = useSaleModalStore();

  const createSale = useCreateSale();
  const updateSale = useUpdateSale();

  const { data: products = [] } = useProducts(); // CONTAINS availableQuantity
  const { data: prices = [] } = useProductPrices();

  const form = useForm<CreateSaleInput>({
    resolver: zodResolver(saleCreateSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      soldAt: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const productId = watch('productId');

  const selectedProduct = useMemo(() => products.find((p) => p.id === productId), [productId, products]);

  const availableQuantity = selectedProduct?.availableQuantity ?? 0;

  const selectedPrice = useMemo(() => {
    if (!productId) return 0;
    const p = prices.find((x) => x.productId === productId);
    return p ? Number(p.price) : 0;
  }, [productId, prices]);

  // Quantity + total
  const quantity = watch('quantity') ?? 0;
  const totalPrice = quantity * selectedPrice;

  useEffect(() => {
    if (quantity > availableQuantity) {
      setError('quantity', {
        type: 'manual',
        message: `La quantité ne peut pas dépasser le stock disponible (${availableQuantity})`,
      });
    } else {
      clearErrors('quantity');
    }
  }, [quantity, availableQuantity, setError, clearErrors]);

  // Edit mode
  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      reset({
        productId: editingItem.productId,
        quantity: editingItem.quantity,
        soldAt: editingItem.soldAt ? new Date(editingItem.soldAt) : undefined,
      });
    } else {
      reset({
        productId: '',
        quantity: 1,
        soldAt: undefined,
      });
    }
  }, [mode, editingItem, reset]);

  const onSubmit = async (data: CreateSaleInput) => {
    if (data.quantity > availableQuantity) {
      setError('quantity', {
        type: 'manual',
        message: `Stock insuffisant. Maximum disponible : ${availableQuantity}`,
      });
      return;
    }

    try {
      if (mode === 'add') {
        await createSale.mutateAsync(data);
      } else if (mode === 'edit' && editingItem) {
        await updateSale.mutateAsync({ id: editingItem.id, data });
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
          <DialogTitle>{mode === 'add' ? 'Nouvelle vente' : 'Modifier la vente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product */}
          <div>
            <label className="mb-1 block text-sm font-medium">Produit</label>
            <Combobox
              options={products.map((p) => ({
                label: `${p.name} (Stock: ${p.availableQuantity})`,
                value: p.id,
              }))}
              value={productId}
              onChange={(val) => setValue('productId', val)}
              placeholder="Sélectionner un produit"
            />
            {errors.productId && <p className="text-sm text-red-600">{errors.productId.message}</p>}
          </div>

          {/* Display available quantity */}
          {selectedProduct && (
            <p className="text-sm text-muted-foreground">
              Stock disponible : <span className="font-semibold text-green-600">{availableQuantity}</span>
            </p>
          )}

          {/* Unit Price */}
          <div>
            <label className="mb-1 block text-sm font-medium">Prix unitaire</label>
            <Input readOnly value={selectedPrice.toLocaleString('fr-FR')} />
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium">Quantité</label>
            <Input type="number" min={1} step={1} {...register('quantity', { valueAsNumber: true })} />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
          </div>

          {/* Total Price */}
          <div>
            <label className="mb-1 block text-sm font-medium">Prix total</label>
            <Input readOnly value={totalPrice.toLocaleString('fr-FR')} />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">Date de vente</label>
            <Controller
              control={control}
              name="soldAt"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={(date) => field.onChange(date ?? undefined)} />
              )}
            />
            {errors.soldAt && <p className="mt-1 text-sm text-red-600">{errors.soldAt.message}</p>}
          </div>

          {/* Buttons */}
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

            <Button type="submit" disabled={isSubmitting || quantity > availableQuantity}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Enregistrement...
                </span>
              ) : mode === 'add' ? (
                'Enregistrer'
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export { SaleForm };
