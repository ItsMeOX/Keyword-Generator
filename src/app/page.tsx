import styles from './styles.module.css';
import DragAndDrop from '../components/DragAndDrop';

export default function Home() {
  return (
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
        <button className={styles.submitButton}>Automate</button>
      </div>
    </main>
  );
}
