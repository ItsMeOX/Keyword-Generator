'use client';

import styles from './styles.module.css';
import DragAndDrop from '../../components/DragAndDrop';
import SubmitButton from '../../components/SubmitButton';
import FileContextProvider from '../contexts/FileContext';
import PromptsCountDisplay from '@/components/PromptsCountDisplay';
import ImagesCountDisplay from '@/components/ImagesCountDisplay';
import KeywordCountChoice from '@/components/KeywordCountChoice';
import SettingContextProvider from '../contexts/SettingContext';
import DebugPanel from '@/components/DebugPanel';
import DebugContextProvider from '../contexts/DebugContext';

export default function Home() {
  return (
    <DebugContextProvider>
      <SettingContextProvider>
        <FileContextProvider>
          <main>
            <div className={styles.outline}>
              <h1 className={styles.title}>Keyword Generator</h1>

              <section className={styles.section}>
                <h2 className={styles.subTitle}>Image Folder</h2>
                <DragAndDrop />
                <ImagesCountDisplay />
              </section>

              <section className={styles.section}>
                <PromptsCountDisplay />
              </section>
            </div>
            <div className={styles.outline}>
              <h2 className={styles.subTitle}>Settings</h2>
              <KeywordCountChoice />
              <SubmitButton />
            </div>
            <div className={styles.outline}>
              <h2 className={styles.subTitle}>Debug Panel</h2>
              <DebugPanel />
            </div>
          </main>
        </FileContextProvider>
      </SettingContextProvider>
    </DebugContextProvider>
  );
}
