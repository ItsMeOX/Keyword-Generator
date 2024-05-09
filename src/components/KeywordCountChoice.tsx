import { useSettingContext } from '@/app/contexts/SettingContext';
import styles from './KeywordCountChoice.module.css';

export default function KeywordCountChoice() {
  const { keywordCount, setKeywordCount } = useSettingContext();

  return (
    <div>
      <span>Keyword Count</span>
      <input
        type="number"
        className={styles.input}
        defaultValue={30}
        onInput={(ev) => setKeywordCount(ev.currentTarget.value)}
      />
    </div>
  );
}
