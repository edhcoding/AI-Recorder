import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export default function ToastList() {
  const { toastList } = useToast();

  return (
    <div className="fixed left-1/2 bottom-10 flex flex-col-reverse gap-2 transform -translate-x-1/2 z-50">
      {toastList.map((toast) => {
        const { id, status, message, isActive } = toast;

        return <Toast key={id} id={id} status={status} message={message} isActive={isActive} />;
      })}
    </div>
  );
}
