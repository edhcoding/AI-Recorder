import PageLayout from '@/components/PageLayout';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout headerProps={{ showBackButton: true, showLogo: false, showTitle: true, title: 'Not Found (404)' }}>
      <div className="flex flex-col items-center justify-center h-full">
        <span className="material-icons text-5xl! mb-4">error_outline</span>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-2">Not Found</h2>
        <p className="text-xl mb-6">페이지를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition"
        >
          홈으로 이동
        </button>
      </div>
    </PageLayout>
  );
}
