import { useFileContext } from '@/app/contexts/FileContext';
import styles from './SubmitButton.module.css';

function makeTextFile(text: string) {
  const data = new Blob([text], { type: 'text/plain' });
  const textFile = URL.createObjectURL(data);

  return textFile;
}

export default function SubmitButton() {
  const { files, setFiles } = useFileContext();

  const onSubmit = async (ev: any) => {
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append(file.name, file, file.name);
    }

    setFiles([]);

    const response = await fetch('/api/gemini', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      const textFile = makeTextFile(data.text);
      const link = document.createElement('a');
      link.href = textFile;
      link.download = 'output.txt';
      link.click();
      URL.revokeObjectURL(textFile);
    } else {
      throw new Error(data.errorMessage);
    }
  };

  return (
    <button className={styles.submitButton} onClick={onSubmit}>
      Automate
    </button>
  );
}
