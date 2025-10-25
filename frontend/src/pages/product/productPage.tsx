import { useState } from 'react';
import { productColumns, type Product } from './';
import { useProducts } from '@/hooks';
import { useProductModalStore } from '@/store';
import { ProductForm } from './ProductForm';
import { EntityPageLayout } from '../entityPageLayout';

const ProductPage = () => {
  const { data: products, isLoading, isError } = useProducts();
  const { openAdd, openEdit } = useProductModalStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = (products ?? []).filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (product: Product) => {
    openEdit(product);
  };

  const columns = productColumns(handleEdit);

  return (
    <EntityPageLayout
      title="Produit"
      breadcrumb="Produit"
      isLoading={isLoading}
      isError={isError}
      onAdd={openAdd}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      data={filteredProducts}
      columns={columns}
      addLabel="Ajouter un produit"
      errorMessage="Une erreur s'est produite en chargeant les produits."
    >
      <ProductForm />
    </EntityPageLayout>
  );
};

export { ProductPage };
