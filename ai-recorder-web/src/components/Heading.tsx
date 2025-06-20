import BackButton from '@/components/BackButton';
import { ROUTES } from '@/constants/route';
import { Link } from 'react-router-dom';

export type HeaderProps = {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showLogo?: boolean;
  showCamera?: boolean;
};

export default function Heading({
  title,
  onBack,
  showBackButton = true,
  showLogo = false,
  showCamera = false,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 h-16 border-b border-gray-200 p-4">
      <div className="flex items-center relative size-full">
        {showBackButton && <BackButton onBack={onBack} />}
        {showLogo && (
          <Link to={ROUTES.home} className="absolute left-0">
            <div className="text-center text-lg flex items-center gap-1 font-santokki">
              AI 녹음 요약하기
              <img src="/assets/images/record-disc.png" alt="logo" className="size-6 inline-block" />
            </div>
          </Link>
        )}
        {showCamera && (
          <button type="button" className="material-icons size-6 absolute right-0">
            camera_alt
          </button>
        )}
        <div className="w-full text-center text-xl font-medium flex justify-center items-center gap-1">
          {title}
          <img src="/assets/images/record-disc.png" alt="logo" className="size-6 inline-block" />
        </div>
      </div>
    </div>
  );
}
