import { createBrowserRouter } from 'react-router';
import { Layout } from '../layout';
import { Dashboard, LoginForm, P404, ProductPage } from '../pages';
import { SupplierPage } from '@/pages/suppliers';
import { PurchasePage } from '@/pages/purchases';
// import Layout from './routes/layout';
// import Dashboard from './routes/dashboard';
// import Login from './routes/login';

// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Layout />}>
//       <Route index element={<Dashboard />} />
//       <Route path="login" element={<Login />} />
//     </Route>
//   )
// );

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: '/products', Component: ProductPage },
      { path: '/suppliers', Component: SupplierPage },
      { path: '/sales', Component: Dashboard },
      { path: '/purchases', Component: PurchasePage },
      { path: '/reports', Component: Dashboard },
    ],
  },
  { path: '/login', Component: LoginForm },
  { path: '*', Component: P404 },
]);

export { router };
