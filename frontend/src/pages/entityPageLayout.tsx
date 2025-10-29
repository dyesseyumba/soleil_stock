import { PageHeader } from '@/components/page-header';
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

interface EntityPageLayoutProps<T> {
  title: string;
  breadcrumb: string;
  isLoading: boolean;
  isError: boolean;
  isDeleteOpen?: boolean;
  onAdd: () => void;
  close?: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  data: T[];
  columns: ColumnDef<T>[];
  addLabel: string;
  errorMessage: string;
  detailDeletion?: string;
  onDelete?: () => void;
  children?: ReactNode;
}

function EntityPageLayout<T>({
  title,
  breadcrumb,
  isLoading,
  isError,
  onAdd,
  searchTerm,
  setSearchTerm,
  data,
  columns,
  addLabel,
  errorMessage,
  children,
}: EntityPageLayoutProps<T>) {
  if (isLoading)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
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
            <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </PageHeader>
        <div className="flex h-screen items-center justify-center">
          <Alert variant="destructive" className="mx-auto max-w-md">
            <AlertCircleIcon />
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        </div>
      </>
    );

  return (
    <>
      <PageHeader>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4">
          <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {title}
          </h3>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="relative w-1/3">
            <SearchIcon className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border py-2 pr-3 pl-8 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <Button className="flex cursor-pointer items-center gap-2" onClick={onAdd}>
            <PlusCircleIcon className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>

        {children}

        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="w-full flex-1 p-2 md:p-4">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export { EntityPageLayout };
