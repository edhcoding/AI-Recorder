import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="fixed top-0 max-w-2xl w-full bg-amber-200">navbar</div>

      <Outlet />
    </>
  );
}
