'use client';

import React, { createContext, useContext, useState } from 'react';

interface DebugContext {
  debugMessages: React.ReactNode[];
  setDebugMessages: React.Dispatch<React.SetStateAction<React.ReactNode[]>>;
}

const DebugContext = createContext<DebugContext | undefined>(undefined);

export default function DebugContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [debugMessages, setDebugMessages] = useState<React.ReactNode[]>([]);

  return (
    <DebugContext.Provider value={{ debugMessages, setDebugMessages }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebugContext() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error(
      'useDebugContext must be used within a DebugContextProvider'
    );
  }

  return context;
}
