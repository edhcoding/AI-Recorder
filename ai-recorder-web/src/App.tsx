import Layout from '@/components/Layout';
import { ToastProvider } from '@/components/Toast/ToastContext';
import ToastList from '@/components/Toast/ToastList';
import { ROUTES } from '@/constants/route';
import { RecorderProvider } from '@/contexts/RecorderContext';
import HomePage from '@/pages/HomePage';
import PhotoPage from '@/pages/PhotoPage';
import RecorderDetailPage from '@/pages/RecorderDetailPage';
import RecorderPage from '@/pages/RecorderPage';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.home,
        element: <HomePage />,
      },
      {
        path: ROUTES.recorder,
        element: <RecorderPage />,
      },
      {
        path: ROUTES.recorderDetail(),
        element: <RecorderDetailPage />,
      },
      {
        path: ROUTES.photo(),
        element: <PhotoPage />,
      },
      {
        path: ROUTES.other,
        element: <div>404</div>,
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RecorderProvider>
        <ToastProvider>
          <ToastList />
          <RouterProvider router={router} />
        </ToastProvider>
      </RecorderProvider>
    </HelmetProvider>
  );
}
