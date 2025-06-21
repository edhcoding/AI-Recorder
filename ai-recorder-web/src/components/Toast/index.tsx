import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { useEffect, useRef } from 'react';

export interface ToastProps {
  id: string;
  status?: 'success' | 'error';
  message: string;
  isActive: boolean;
}

export default function Toast({ id, status = 'success', message, isActive }: ToastProps) {
  const { closeToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive || ref.current === null) return;

    ref.current.getAnimations().forEach((animation) => {
      animation.onfinish = () => closeToast(id);
    });
  }, [isActive, closeToast, id]);

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center px-6 py-4 leading-relaxed whitespace-nowrap shadow-2xl rounded-lg text-base text-white',
        {
          'bg-black': status === 'success',
          'bg-error': status === 'error',
          'animate-fade-in-up': isActive,
          'animate-fade-out-down': !isActive,
        },
      )}
    >
      {status === 'success' && <span className="material-icons mr-2">check_circle</span>}
      {status === 'error' && <span className="material-icons mr-2">error</span>}
      {message}
    </div>
  );
}
