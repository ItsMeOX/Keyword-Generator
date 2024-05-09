'use client';

import { createContext, useContext, useState } from 'react';

interface SettingContext {
  keywordCount: string;
  setKeywordCount: React.Dispatch<React.SetStateAction<string>>;
}

const SettingContext = createContext<SettingContext | undefined>(undefined);

export default function SettingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [keywordCount, setKeywordCount] = useState('30');

  return (
    <SettingContext.Provider value={{ keywordCount, setKeywordCount }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettingContext() {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error(
      'useSettingContext must be used within a FileContextProvider'
    );
  }

  return context;
}
