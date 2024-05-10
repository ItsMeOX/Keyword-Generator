import { useFileContext } from '@/app/contexts/FileContext';
import { useEffect, useState } from 'react';
import styles from './ImageCountDisplay.module.css';

async function getImagesCount(files: File[]): Promise<number> {
  let imagesCount = 0;
  for (let file of files) {
    if (file.type.startsWith('image/')) {
      imagesCount++;
    }
  }

  return imagesCount;
}

export default function ImagesCountDisplay() {
  const { files, setFiles } = useFileContext();
  const [imagesCount, setImagesCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchImagesCount = async () => {
      try {
        const count = await getImagesCount(files);
        setImagesCount(count);
      } catch (error) {
        console.error('Count images error: ', error);
      }
    };

    fetchImagesCount();
  }, [files]);

  return (
    <p>
      Total images:{' '}
      <span>{`${imagesCount === null ? 'fetching...' : imagesCount}`}</span>
    </p>
  );
}
