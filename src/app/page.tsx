'use client';

import { createContext } from 'react';

import styles from './styles.module.css';
import DragAndDrop from '../components/DragAndDrop';
import SubmitButton from '../components/SubmitButton';
import FileContextProvider from './contexts/FileContext';

export default function Home() {
  return (
    <FileContextProvider>
      <main>
        <div className={styles.outline}>
          <h1 className={styles.title}>Keyword Generator</h1>

          <section className={styles.section}>
            <h2 className={styles.subTitle}>Image Folder</h2>
            <DragAndDrop />
          </section>

          <section className={styles.section}>
            <h2 className={styles.subTitle}>Prompt File</h2>
            <DragAndDrop />
          </section>
        </div>
        <div className={styles.outline}>
          <h2 className={styles.subTitle}>Settings</h2>
          <SubmitButton />
        </div>
      </main>
    </FileContextProvider>
  );
}
