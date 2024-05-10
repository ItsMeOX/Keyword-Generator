import { useDebugContext } from '@/app/contexts/DebugContext';
import styles from './DebugPanel.module.css';
import Image from 'next/image';

export default function DebugPanel() {
  const { debugMessages, setDebugMessages } = useDebugContext();

  // TODO: create span using an util function that accepts (message, debugType)
  return (
    <>
      <div className={styles.outline}>{debugMessages.map((node) => node)}</div>
      <button className={styles.button} onClick={(e) => setDebugMessages([])}>
        <Image
          src={'/bin.png'}
          alt="RmIcon"
          height={18}
          width={18}
          className={styles.buttonIcon}
        />
        Clear
      </button>
    </>
  );
}
