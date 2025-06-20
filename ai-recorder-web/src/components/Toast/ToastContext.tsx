import { createContext, useState } from 'react';
import { generateUuid } from '@/utils/generateUuid';
import type { PropsWithChildren } from 'react';
import type { ToastProps } from '@/components/Toast';
import { MAX_TOAST_COUNT } from '@/constants/toast';

interface ToastContextProps {
  toastList: ToastProps[];
  closeToast: (id: ToastProps['id']) => void;
  showToast: (status: ToastProps['status'], message: ToastProps['message']) => void;
}

export const ToastContext = createContext<ToastContextProps>({} as ToastContextProps);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toastList, setToastList] = useState<ToastProps[]>([]);

  const closeToast = (id: ToastProps['id']) => {
    setToastList((prev) => prev.filter((toast) => toast.id !== id));
  };

  const deactivateToast = (id: ToastProps['id']) => {
    setToastList((prev) =>
      prev.map((toast) => {
        if (toast.id !== id) return toast;

        return {
          ...toast,
          isActive: false,
        };
      }),
    );
  };

  const showToast = (status: ToastProps['status'], message: ToastProps['message']) => {
    const toastId = generateUuid();
    const newToast = { id: toastId, status, message, isActive: true };

    setToastList((prev) => {
      if (toastList.length >= MAX_TOAST_COUNT) return [...prev.slice(1), newToast];

      return [...prev, newToast];
    });

    setTimeout(() => deactivateToast(toastId), 4000);
  };

  return <ToastContext.Provider value={{ toastList, showToast, closeToast }}>{children}</ToastContext.Provider>;
};
