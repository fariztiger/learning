'use client';

/* Language provider — instant EN/BM switching across the whole app. */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Lang, S } from './types';
import { UI, type UIKey } from './ui';

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: UIKey) => string; L: (s: S) => string }>({
  lang: 'en',
  setLang: () => {},
  t: (k) => UI[k].en,
  L: (s) => s.en,
});

export const LANG_KEY = 'tigerfx.lang';

export function pick(s: S, lang: Lang): string {
  return lang === 'ms' ? s.ms : s.en;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === 'en' || saved === 'ms') setLangState(saved);
    } catch {
      /* private mode */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l === 'ms' ? 'ms' : 'en';
  }, []);

  const t = useCallback((k: UIKey) => UI[k][lang], [lang]);
  const L = useCallback((s: S) => pick(s, lang), [lang]);

  return <LangCtx.Provider value={{ lang, setLang, t, L }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
