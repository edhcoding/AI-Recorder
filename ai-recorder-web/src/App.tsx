import Layout from '@/components/Layout';
import { ROUTES } from '@/constants/route';
import HomePage from '@/pages/HomePage';
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
        path: ROUTES.other,
        element: <div>404</div>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
