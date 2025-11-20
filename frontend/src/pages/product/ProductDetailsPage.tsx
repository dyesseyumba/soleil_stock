import { Button } from '@/components/ui/button';
import { AlertCircleIcon, PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useParams } from 'react-router';
import { useDeleteProductPrice, usePricesByProductId, useProduct } from '@/hooks';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProductPriceModalStore, type ProductPrice } from '@/store';
import { productPricesColumns, SupplierForm } from '.';
import { DataTable } from '@/components/data-table';
import { toast, Toaster } from 'sonner';

function ProductDetailsPage() {
  const { id } = useParams();

  const { data: product, isLoading: loadingProduct, isError: errorProduct } = useProduct(id!);
  const { data: prices = [], isLoading: loadingPrices, isError: errorPrices, refetch } = usePricesByProductId(id!);
  const { openAdd, openEdit } = useProductPriceModalStore();

  const deleteProductPrice = useDeleteProductPrice();

  const handleEdit = (productPrice: ProductPrice) => {
    openEdit(productPrice);
  };

  const handleDelete = async (productPrice: ProductPrice) => {
    try {
      await deleteProductPrice.mutateAsync(productPrice.id);
      toast.success(`Le prix '${productPrice.price}' a été supprimé.`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Impossible de supprimer le prix ${productPrice.price}.`);
    }
  };

  const columns = productPricesColumns(handleEdit, handleDelete);

  if (loadingProduct || loadingPrices)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Produit</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Détail du Produit</BreadcrumbPage>
          </BreadcrumbItem>
        </PageHeader>
        <div className="flex h-screen items-center justify-center">
          <Button disabled>
            <Spinner />
            Chargement...
          </Button>
        </div>
      </>
    );

  if (errorProduct || errorPrices)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Produit</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Détail du Produit</BreadcrumbPage>
          </BreadcrumbItem>
        </PageHeader>
        <div className="flex h-screen items-center justify-center">
          <Alert variant="destructive" className="mx-auto max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Une erreur s'est produite en chargeant le produits.</AlertTitle>
          </Alert>
        </div>
      </>
    );

  return (
    <>
      <Toaster />
      <PageHeader>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Produit</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Détail du Produit</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">{product?.name}</h3>

        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">
              {product?.availableQuantity
                ? new Intl.NumberFormat('fr-FR').format(product?.availableQuantity)
                : ''}
            </p>
            <p className="text-sm text-gray-600">Quantité Disponible</p>
          </div>
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">
              {product?.price
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(
                    product?.price,
                  )
                : ''}
            </p>
            <p className="text-sm text-gray-600">Prix</p>
          </div>
          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">
              {product?.totalValue
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(
                    product?.totalValue,
                  )
                : ''}
            </p>
            <p className="text-sm text-gray-600">Valeur Total</p>
          </div>

          <div className="rounded bg-gray-200 p-6 text-center shadow">
            <p className="text-3xl font-semibold">
              {product?.nextToExpire
                ? format(new Date(product?.nextToExpire), 'dd MMM yyyy', { locale: fr })
                : ''}
            </p>
            <p className="text-sm text-gray-600">Date d'Expiration</p>
          </div>
        </div>

        <div className="rounded border bg-white p-4">
          <p className="text-gray-700">{product?.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Historique des prix</h2>

          <Button size="sm" className="cursor-pointer" onClick={openAdd}>
            <PlusCircle className="mr-1 h-4 w-4" /> Nouveau prix
          </Button>
        </div>

        <DataTable columns={columns} data={prices} />

        <SupplierForm />
      </div>
    </>
  );
}

export { ProductDetailsPage };
