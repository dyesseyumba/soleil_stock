import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DataTable } from '../../components/data-table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useSupplierModalStore, type Supplier } from '@/store';
import { useSuppliers } from '@/hooks';
import { supplierColumns } from './supplierColumns';

const SupplierPage = () => {
  const { data: suppliers, isLoading, isError } = useSuppliers();
  const { openAdd, openEdit } = useSupplierModalStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = (suppliers ?? []).filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactInfo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier: Supplier) => {
    openEdit(supplier);
  };

  const columns = supplierColumns(handleEdit);

  if (isLoading)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Produit</BreadcrumbPage>
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
  if (isError)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Produit</BreadcrumbPage>
          </BreadcrumbItem>
        </PageHeader>
        <div className="flex h-screen items-center justify-center">
          <Alert variant="destructive" className="mx-auto max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Une erreur s'est produite en chargeant les produit.</AlertTitle>
          </Alert>
        </div>
      </>
    );

  return (
    <>
      <PageHeader>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Produit</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4">
          <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Supplier
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="relative w-1/3">
            <SearchIcon className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border py-2 pr-3 pl-8 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <Button className="flex cursor-pointer items-center gap-2" onClick={() => openAdd()}>
            <PlusCircleIcon className="h-4 w-4" />
            Ajouter un Fournisseur
          </Button>
        </div>
        {/* <SupplierForm /> */}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="w-full flex-1 p-2 md:p-4">
            <DataTable columns={columns} data={filteredSuppliers} />
          </div>
        </div>
      </div>
    </>
  );
};

export { SupplierPage };
