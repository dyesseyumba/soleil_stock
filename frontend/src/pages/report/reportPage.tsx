import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts, useReport } from '@/hooks';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

function ReportPage() {
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const [product, setProduct] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  const {
    data: reports,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    refetch,
  } = useReport({
    product: product ?? undefined,
    fromDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
    toDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
  });

  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [product, startDate, endDate, refetch]);

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

  if (isLoadingReport || isLoadingProducts)
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
            <Select onValueChange={(val) => setProduct(val === 'all' ? undefined : val)} value={product}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les produits</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>De</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {startDate ? format(startDate, 'yyyy-MM-dd') : 'Select'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  required={false}
                  selected={startDate }
                  onSelect={(date: Date | undefined) => date && setStartDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label>A</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {endDate ? format(endDate, 'yyyy-MM-dd') : 'Select'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  required={false}
                  selected={endDate ?? undefined}
                  onSelect={(date: Date | undefined) => date && setEndDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* <div className="flex items-end">
            <Button className="w-full" onClick={runSearch}>
              Search
            </Button>
          </div> */}
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
