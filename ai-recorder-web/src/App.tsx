import Layout from '@/components/Layout';
import { ToastProvider } from '@/components/Toast/ToastContext';
import ToastList from '@/components/Toast/ToastList';
import { ROUTES } from '@/constants/route';
import { ModalProvider } from '@/contexts/ModalContext';
import { RecorderProvider } from '@/contexts/RecorderDataContext';
import NotFoundPage from '@/pages/404';
import HomePage from '@/pages/HomePage';
import PhotoPage from '@/pages/PhotoPage';
import RecorderDetailPage from '@/pages/RecorderDetailPage';
import RecorderListPage from '@/pages/RecorderListPage';
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
        path: ROUTES.recorderList,
        element: <RecorderListPage />,
      },
      {
        path: ROUTES.other,
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RecorderProvider>
        <ModalProvider>
          <ToastProvider>
            <ToastList />
            <RouterProvider router={router} />
          </ToastProvider>
        </ModalProvider>
      </RecorderProvider>
    </HelmetProvider>
  );
}
