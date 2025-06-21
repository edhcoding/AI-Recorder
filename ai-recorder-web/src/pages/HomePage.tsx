import PageLayout from '@/components/PageLayout';
import { ROUTES } from '@/constants/route';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const onClickRecorder = useCallback(() => {
    navigate(ROUTES.recorder);
  }, [navigate]);

  return (
    <PageLayout headerProps={{ showBackButton: false, showLogo: true }}>
      <button
        type="button"
        onClick={onClickRecorder}
        className="bg-black text-white py-2 px-4 rounded-3xl flex items-center absolute bottom-7 right-4 hover:bg-black/90 cursor-pointer"
      >
        <span className="material-icons size-6">mic</span>
        <span className="text-sm ml-1 text-pr">녹음하기</span>
      </button>
    </PageLayout>
  );
}
