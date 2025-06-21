import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Helmet>
        <title>AI Recorder - 음성 녹음 및 AI 요약 서비스</title>
      </Helmet>

      <Outlet />
    </>
  );
}
