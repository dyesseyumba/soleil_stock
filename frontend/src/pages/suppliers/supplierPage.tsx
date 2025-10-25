import { useState } from 'react';
import { supplierColumns, SupplierForm, type Supplier } from './';
import { useSuppliers } from '@/hooks';
import { useSupplierModalStore } from '@/store';
import { EntityPageLayout } from '../entityPageLayout';

const SupplierPage = () => {
  const { data: suppliers, isLoading, isError } = useSuppliers();
  const { openAdd, openEdit } = useSupplierModalStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = (suppliers ?? []).filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactInfo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (supplier: Supplier) => {
    openEdit(supplier);
  };

  const columns = supplierColumns(handleEdit);

  return (
    <EntityPageLayout
      title="Produit"
      breadcrumb="Produit"
      isLoading={isLoading}
      isError={isError}
      onAdd={openAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      data={filteredSuppliers}
      columns={columns}
      addLabel="Ajouter un fournisseurs"
      errorMessage="Une erreur s'est produite en chargeant les fournisseurs."
    >
      <SupplierForm />
    </EntityPageLayout>
  );
};

export { SupplierPage };
