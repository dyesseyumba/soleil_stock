import { RouterProvider } from 'react-router';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { registerSW } from 'virtual:pwa-register';

// const updateSW = registerSW({
//   onNeedRefresh() {
//     console.log('New version available');
//   },
//   onOfflineReady() {
//     console.log('App ready for offline use');
//   },
// });

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
