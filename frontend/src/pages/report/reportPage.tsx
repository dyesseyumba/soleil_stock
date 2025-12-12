import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReport } from '@/hooks';
import { PageHeader } from '@/components/page-header';
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { reportColumn } from './reportColumns';
import type { ReportRow } from '@/store';

function ReportPage() {
  const [product, setProduct] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: reports, isLoading: isLoadingReport, isError: isErrorReport } = useReport();

  const totalRow: ReportRow = {
    id: undefined,
    product: 'Total',
    sold: reports?.reduce((sum, r) => sum + r.sold, 0) || 0,
    revenue: reports?.reduce((sum, r) => sum + r.revenue, 0) || 0,
    cost: reports?.reduce((sum, r) => sum + r.cost, 0) || 0,
    profit: reports?.reduce((sum, r) => sum + r.profit, 0) || 0,
  };

  const dataWithTotal = [...(reports ?? []), totalRow];

  const columns = reportColumn();

  if (isLoadingReport)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Rapport</BreadcrumbPage>
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

  if (isErrorReport)
    return (
      <>
        <PageHeader>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Rapport</BreadcrumbPage>
          </BreadcrumbItem>
        </PageHeader>
        <div className="flex h-screen items-center justify-center">
          <Alert variant="destructive" className="mx-auto max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Une erreur s'est produite lors du chargement</AlertTitle>
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
          <BreadcrumbPage>Rapport</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4">
          <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Rapport
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Product</Label>
            <Select onValueChange={setProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sugar">Sugar</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Flour">Flour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>From</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>To</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        {/* {children} */}

        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="w-full flex-1 p-2 md:p-4">
            <DataTable columns={columns} data={dataWithTotal ?? []} />
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export { ReportPage };
