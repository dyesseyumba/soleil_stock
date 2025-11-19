import { useState } from 'react';
import { saleColumns, SaleForm } from './';
import { useDeleteSale, useSales } from '@/hooks';
import { useSaleModalStore, type Sale } from '@/store';
import { EntityPageLayout } from '../entityPageLayout';
import { toast } from 'sonner';

const SalePage = () => {
  const { data: sales, isLoading, isError, refetch } = useSales();
  const { openAdd, openEdit } = useSaleModalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const deleteSale = useDeleteSale();

  const filteredSales = (sales ?? []).filter((sale) =>
    sale.productName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (sale: Sale) => {
    openEdit(sale);
  };

  const handleDelete = async (sale: Sale) => {
    try {
      await deleteSale.mutateAsync(sale.id);
      toast.success(`La vente du produit ${sale.productName} a été supprimé.`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Impossible de supprimer la vente du produit ${sale.productName}.`);
    }
  };

  const columns = saleColumns(handleEdit, handleDelete);

  return (
    <EntityPageLayout
      title="Vente"
      breadcrumb="Vente"
      isLoading={isLoading}
      isError={isError}
      onAdd={openAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      data={filteredSales}
      columns={columns}
      addLabel="Ajouter une vente"
      errorMessage="Une erreur s'est produite lors du chargement des ventes."
    >
      <SaleForm />
    </EntityPageLayout>
  );
};

export { SalePage };
