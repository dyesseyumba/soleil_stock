import { useState } from 'react';
import { supplierColumns, SupplierForm, type Supplier } from './';
import { useDeleteSupplier, useSuppliers } from '@/hooks';
import { useSupplierModalStore } from '@/store';
import { EntityPageLayout } from '../entityPageLayout';
import { toast } from "sonner";

const SupplierPage = () => {
  const { data: suppliers, isLoading, isError, refetch } = useSuppliers();
  const { openAdd, openEdit } = useSupplierModalStore();
  const [searchTerm, setSearchTerm] = useState('');
  const deleteSupplier = useDeleteSupplier();

  const filteredSuppliers = (suppliers ?? []).filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactInfo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (supplier: Supplier) => {
    openEdit(supplier);
  };

  const handleDelete = async (supplier: Supplier) => {
    try {
      await deleteSupplier.mutateAsync(supplier.id);
      toast.success(`Le fournisseur ${supplier.name} a été supprimé.`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Impossible de supprimer ${supplier.name}.`);
    }
  };

  const columns = supplierColumns(handleEdit, handleDelete);

  return (
    <EntityPageLayout
      title="Fournisseurs"
      breadcrumb="Fournisseurs"
      isLoading={isLoading}
      isError={isError}
      onAdd={openAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      data={filteredSuppliers}
      columns={columns}
      addLabel="Ajouter un fournisseur"
      errorMessage="Une erreur s'est produite lors du chargement des fournisseurs."
    >
      <SupplierForm />
    </EntityPageLayout>
  );
};

export { SupplierPage };
