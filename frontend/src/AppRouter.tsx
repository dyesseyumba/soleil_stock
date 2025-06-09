import { createBrowserRouter } from 'react-router';
import { Layout } from './layout';
import { Dashboard } from './pages';
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
      { path: '/products', Component: Dashboard },
      { path: '/providers', Component: Dashboard },
      { path: '/sales-purchases', Component: Dashboard },
      { path: '/reports', Component: Dashboard },
    ],
  },
  { path: '/login', Component: Layout },
  { path: '/404', Component: Layout },
]);

export { router };
