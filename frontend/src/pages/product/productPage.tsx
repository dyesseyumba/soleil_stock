import { PageHeader } from '@/components/page-header';
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Product = () => {
  return (
    <>
      <PageHeader>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Produit</BreadcrumbPage>
        </BreadcrumbItem>
      </PageHeader>
      <h1>Product</h1>
    </>
  );
};




export { Product };
