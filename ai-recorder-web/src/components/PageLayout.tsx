import Heading, { type HeaderProps } from '@/components/Heading';
import type { ReactNode } from 'react';

interface Props {
  disableHeader?: boolean;
  children: ReactNode;
  headerProps?: HeaderProps;
}

export default function PageLayout({ children, disableHeader, headerProps }: Props) {
  return (
    <div className="h-dvh relative flex flex-col">
      {!disableHeader && <Heading {...headerProps} />}
      <main className="flex-1 relative max-w-2xl flex flex-col p-4 bg-bg">{children}</main>
    </div>
  );
}
