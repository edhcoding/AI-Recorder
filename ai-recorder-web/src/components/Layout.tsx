import { getPageTitle } from '@/utils/route';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      <Helmet>
        <title>
          {pageTitle
            ? `AI Recorder - 음성 녹음 및 AI 요약 서비스 | ${pageTitle}`
            : `AI Recorder - 음성 녹음 및 AI 요약 서비스`}
        </title>
      </Helmet>

      <Outlet />
    </>
  );
}
