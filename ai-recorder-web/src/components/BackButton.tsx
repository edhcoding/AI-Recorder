import { ROUTES } from '@/constants/route';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  onBack?: () => void;
}

export default function BackButton({ onBack, ...props }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickBack = useCallback(() => {
    if (onBack) onBack();
    if (location.pathname === ROUTES.home) return;

    if (window.history.length > 1) {
      const previousUrl = document.referrer; // 이전 페이지의 URL
      const currentDomain = window.location.origin; // 현재 도메인

      if (previousUrl && previousUrl.startsWith(currentDomain)) window.history.back();
      else navigate(ROUTES.home);
    } else navigate(ROUTES.home);
  }, [location.pathname, navigate, onBack]);

  return (
    <button
      type="button"
      onClick={onClickBack}
      className="absolute left-0 material-icons size-6 cursor-pointer"
      {...props}
    >
      arrow_back_ios
    </button>
  );
}
