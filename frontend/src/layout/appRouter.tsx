import { createBrowserRouter } from 'react-router';
import { Layout } from '../layout';
import { Dashboard,  LoginPage,  P404, ProductDetailsPage, ProductPage, PurchasePage, SalePage, SupplierPage } from '../pages';
import { ReportPage } from '@/pages/report';


const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: '/products', Component: ProductPage },
      { path: '/products/:id', Component: ProductDetailsPage },
      { path: '/suppliers', Component: SupplierPage },
      { path: '/sales', Component: SalePage },
      { path: '/purchases', Component: PurchasePage },
      { path: '/reports', Component: ReportPage },
    ],
  },
  { path: '/login', Component: LoginPage },
  { path: '*', Component: P404 },
]);

export { router };
