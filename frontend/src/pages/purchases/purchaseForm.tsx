import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { usePurchaseModalStore } from '@/store';
import { useCreatePurchase, useUpdatePurchase, useProducts, useSuppliers } from '@/hooks';
import { purchaseCreateSchema, type CreatePurchaseInput } from '@/schemas';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';

export const PurchaseForm = () => {
  const { isOpen, close, mode, editingItem } = usePurchaseModalStore();
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliers();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePurchaseInput>({
    resolver: zodResolver(purchaseCreateSchema),
    defaultValues: {
      productId: '',
      supplierId: '',
      quantity: 1,
      unitCost: 0,
      expirationDate: undefined
    },
  });

  // Compute total price dynamically
  const quantity = watch('quantity');
  const unitCost = watch('unitCost');
  const totalPrice = useMemo(() => Number(quantity || 0) * Number(unitCost || 0), [quantity, unitCost]);

  // Handle edit mode
  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      reset({
        productId: editingItem.productId ?? '',
        supplierId: editingItem.supplierId ?? '',
        quantity: editingItem.quantity ?? 1,
        unitCost: editingItem.unitCost ?? 0,
        expirationDate: editingItem.expirationDate ?? undefined
      });
    } else {
      reset({
        productId: '',
        supplierId: '',
        quantity: 1,
        unitCost: 0,
        expirationDate: undefined,
      });
    }
  }, [mode, editingItem, reset]);

  const onSubmit = async (data: CreatePurchaseInput) => {
    console.log(data)
    try {
      if (mode === 'add') {
        await createPurchase.mutateAsync(data);
      } else if (mode === 'edit' && editingItem) {
        await updatePurchase.mutateAsync({ id: editingItem.id, data });
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
          <DialogTitle>{mode === 'add' ? 'Nouvelle commande' : 'Modifier une commande'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium">Produit</label>
            <Combobox
              options={products.map((p) => ({ label: p.name, value: p.id }))}
              value={watch('productId')}
              onChange={(val) => setValue('productId', val)}
              placeholder="Sélectionner un produit"
            />
            {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>}
          </div>

          {/* Supplier Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium">Fournisseur</label>
            <Combobox
              options={suppliers.map((s) => ({ label: s.name, value: s.id }))}
              value={watch('supplierId')}
              onChange={(val) => setValue('supplierId', val)}
              placeholder="Sélectionner un fournisseur"
            />
            {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId.message}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium">Quantité</label>
            <Input type="number" min={1} step={1} {...register('quantity', { valueAsNumber: true })} />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
          </div>

          {/* Unit Cost */}
          <div>
            <label className="mb-1 block text-sm font-medium">Prix unitaire</label>
            <Input type="number" min={0} step={25} {...register('unitCost', { valueAsNumber: true })} />
            {errors.unitCost && <p className="mt-1 text-sm text-red-600">{errors.unitCost.message}</p>}
          </div>

          {/* Total Price (read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium">Prix total</label>
            <Input readOnly value={totalPrice.toLocaleString('fr-FR')} />
          </div>

          {/* Expiration Date with DatePicker */}
          <div>
            <label className="mb-1 block text-sm font-medium">Date d'expiration</label>
            <Controller
              control={control}
              name="expirationDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ?? undefined)}
                />
              )}
            />
            {errors.expirationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
            )}
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
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
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
