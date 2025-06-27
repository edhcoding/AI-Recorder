import BackButton from '@/components/BackButton';
import { ROUTES } from '@/constants/route';
import { Link, useParams } from 'react-router-dom';

export type HeaderProps = {
  title?: string;
  onBack?: () => void;
  onCamera?: () => void;
  showBackButton?: boolean;
  showLogo?: boolean;
  showCamera?: boolean;
  showDetailCamera?: boolean;
  showTitle?: boolean;
};

export default function Heading({
  title,
  onBack,
  onCamera,
  showBackButton = true,
  showLogo = false,
  showCamera = false,
  showDetailCamera = false,
  showTitle = false,
}: HeaderProps) {
  const params = useParams();
  const hasReactNativeWebview = typeof window !== 'undefined' && window.ReactNativeWebView != null;

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 px-4 bg-white/40 backdrop-blur-md">
      <div className="flex items-center relative h-16">
        {showBackButton && <BackButton onBack={onBack} />}
        {showLogo && (
          <Link to={ROUTES.home} className="absolute left-1/2 -translate-x-1/2">
            <div className="text-center text-xl flex items-center gap-1 font-santokki">
              AI 음성 녹음기
              <img src="/assets/images/record-disc.png" alt="logo" className="size-6 inline-block" />
            </div>
          </Link>
        )}
        {showCamera && hasReactNativeWebview && (
          <button type="button" onClick={onCamera} className="absolute right-0 flex items-center cursor-pointer">
            <span className="material-icons text-3xl!">camera_alt</span>
          </button>
        )}
        {showDetailCamera && hasReactNativeWebview && (
          <Link to={ROUTES.photo(params.recorderId)} className="absolute right-0 flex items-center cursor-pointer">
            <span className="material-icons text-3xl! text-neutral-600">image</span>
          </Link>
        )}
        {showTitle && (
          <div className="w-full text-center text-xl font-santokki font-medium flex justify-center items-center gap-1">
            {title}
            <img src="/assets/images/record-disc.png" alt="logo" className="size-6 inline-block" />
          </div>
        )}
      </div>
    </div>
  );
}
