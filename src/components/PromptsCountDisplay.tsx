import { useFileContext } from '@/app/contexts/FileContext';
import getPromptsArray from '@/app/utils/getPromptsArray';
import { useEffect, useState } from 'react';

async function getPromptsCount(files: File[]): Promise<number> {
  let promptsCount = 0;
  for (let file of files) {
    if (file.type.startsWith('text/')) {
      const arr = await getPromptsArray(file);
      const len = arr.length;
      promptsCount += len;
    }
  }

  return promptsCount;
}

export default function PromptsCountDisplay() {
  const { files, setFiles } = useFileContext();
  const [promptsCount, setPromptsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPromptsCount = async () => {
      try {
        const count = await getPromptsCount(files);
        setPromptsCount(count);
      } catch (error) {
        console.error('Count prompts error: ', error);
      }
    };

    fetchPromptsCount();
  }, [files]);

  return (
    <p>{`Total prompts: ${
      promptsCount === null ? 'fetching...' : promptsCount
    }`}</p>
  );
}
