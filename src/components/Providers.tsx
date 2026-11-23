'use client';

import { useEffect } from 'react';
import { LangProvider } from '@/lib/i18n';
import { progressActions } from '@/lib/progress';
import { Toaster } from './Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    progressActions.init();
  }, []);
  return (
    <LangProvider>
      {children}
      <Toaster />
    </LangProvider>
  );
}
