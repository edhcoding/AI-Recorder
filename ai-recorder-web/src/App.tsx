import Layout from '@/components/Layout';
import { ROUTES } from '@/constants/route';
import HomePage from '@/pages/HomePage';
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
        path: ROUTES.other,
        element: <div>404</div>,
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
