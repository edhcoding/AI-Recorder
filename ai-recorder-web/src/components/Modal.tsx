import { useModal } from '@/hooks/useModal';
import { Fragment, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children }: { children: ReactNode }) {
  const { isModalOpen } = useModal();

  return (
    <Fragment>
      {isModalOpen &&
        createPortal(
          <div role="dialog" aria-modal>
            {children}
          </div>,
          document.body,
        )}
    </Fragment>
  );
}
