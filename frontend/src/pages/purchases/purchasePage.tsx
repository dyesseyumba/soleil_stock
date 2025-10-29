import { useState } from 'react';
import { purchaseColumns } from './';
import { useDeletePurchase, usePurchases } from '@/hooks';
import { usePurchaseModalStore, type Purchase } from '@/store';
import { EntityPageLayout } from '../entityPageLayout';
import { toast } from "sonner";

const PurchasePage = () => {
  const { data: purchases, isLoading, isError, refetch } = usePurchases();
  const { openAdd, openEdit } = usePurchaseModalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const deletePurchase = useDeletePurchase();

  const filteredPurchases = (purchases ?? []).filter(
    (purchase) =>
      purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (purchase: Purchase) => {
    openEdit(purchase);
  };

  const handleDelete = async (purchase: Purchase) => {
    try {
      await deletePurchase.mutateAsync(purchase.id);
      toast.success(`La commande du produit ${purchase.productName} a été supprimé.`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Impossible de supprimer la commande du produit ${purchase.productName}.`);
    }
  };

  const columns = purchaseColumns(handleEdit, handleDelete);

  return (
    <EntityPageLayout
      title="Commande"
      breadcrumb="Commande"
      isLoading={isLoading}
      isError={isError}
      onAdd={openAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      data={filteredPurchases}
      columns={columns}
      addLabel="Ajouter une commande"
      errorMessage="Une erreur s'est produite lors du chargement des commandes."
    >
      {/* <PurchaseForm /> */}
    </EntityPageLayout>
  );
};

export { PurchasePage };
