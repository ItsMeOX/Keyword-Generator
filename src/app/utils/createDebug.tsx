import { useDebugContext } from '../contexts/DebugContext';
import styles from '@/components/DebugPanel.module.css';

function addPrecedingZero(str: string) {
  if (str.length === 1) return '0' + str;
  return str;
}

let debugIndex = 0;

/**
 * Creates a debug <span> and append it to debugMessages based on type of message.
 */
export default function createDebug(
  message: string,
  messageType: 'normal' | 'error' | 'success',
  debugMessages: React.ReactNode[],
  setDebugMessages: React.Dispatch<React.SetStateAction<React.ReactNode[]>>
) {
  let span: React.ReactNode;

  const date = new Date();
  const hour = addPrecedingZero(date.getHours().toString());
  const minute = addPrecedingZero(date.getMinutes().toString());

  const dataStr = `[${hour}:${minute}] `;

  if (messageType === 'normal') {
    span = (
      <span key={`Debug${debugIndex++}`} className={styles.spanNormal}>
        {dataStr + message}
      </span>
    );
  } else if (messageType === 'error') {
    span = (
      <span key={`Debug${debugIndex++}`} className={styles.spanError}>
        {dataStr + message}
      </span>
    );
  } else if (messageType === 'success') {
    span = (
      <span key={`Debug${debugIndex++}`} className={styles.spanSuccess}>
        {dataStr + message}
      </span>
    );
  }

  setDebugMessages((prevSpans) => [...prevSpans, span]);
}
