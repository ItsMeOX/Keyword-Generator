'use client';

import React, { createContext, useContext, useState } from 'react';

interface FileContext {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileContext = createContext<FileContext | undefined>(undefined);

export default function FileContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<File[]>([]);

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
