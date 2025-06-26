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
    <PageLayout headerProps={{ showBackButton: false, showLogo: true, showTitle: false }}>
      <div className="flex flex-col items-center justify-center text-center h-full">
        <div className="size-48 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <div className="size-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="material-icons text-white text-4xl">mic</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">AI 음성 녹음기</h1>
        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
          음성을 녹음하고 AI가 자동으로
          <br />
          텍스트로 변환해드립니다
        </p>

        <button
          type="button"
          onClick={onClickRecorder}
          className="bg-primary text-white py-2 px-4 rounded-xl flex items-center max-w-52 w-full justify-center hover:bg-primary/90 cursor-pointer mb-6"
        >
          <span className="material-icons text-3xl!">mic</span>
          <span className="text-md ml-1">녹음 시작하기</span>
        </button>

        <div className="grid grid-cols-1 gap-6 mb-12 w-full max-w-md">
          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary text-xl">record_voice_over</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-black">고품질 녹음</h3>
              <p className="text-sm text-gray-600">선명하고 깨끗한 음성 녹음</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary text-xl">smart_toy</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-black">AI 변환</h3>
              <p className="text-sm text-gray-600">정확한 음성-텍스트 변환</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-icons text-primary text-xl">save</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-black">자동 저장</h3>
              <p className="text-sm text-gray-600">녹음 내용을 안전하게 보관</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
