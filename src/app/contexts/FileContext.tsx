'use client';

import React, { createContext, useContext, useState } from 'react';

interface FileContext {
  files: any[];
  setFiles: React.Dispatch<React.SetStateAction<any>>;
}

const FileContext = createContext<FileContext | undefined>(undefined);

export default function FileContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<any[]>([]);

  return (
    <FileContext.Provider value={{ files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileContextProvider');
  }

  return context;
}
