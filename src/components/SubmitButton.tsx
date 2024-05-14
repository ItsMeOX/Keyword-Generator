import { MJMessage } from 'midjourney';
import { useFileContext } from '@/app/contexts/FileContext';
import styles from './SubmitButton.module.css';
import React from 'react';
import getPromptsArray from '@/app/utils/getPromptsArray';
import { useSettingContext } from '@/app/contexts/SettingContext';
import createDebug from '@/app/utils/createDebug';
import { useDebugContext } from '@/app/contexts/DebugContext';
import JSZip from 'jszip';
import fs from 'fs/promises';

type debugContextType = {
  debugMessages: React.ReactNode[];
  setDebugMessages: React.Dispatch<React.SetStateAction<React.ReactNode[]>>;
};

async function getMainExe() {
  return await fs.readFile('/pythonUtil/main.exe');
}

function saveAsZipFiles(content: (File | string)[]) {
  const zip = new JSZip();
  let kwIndex = 0;

  for (let file of content) {
    console.log(file, file instanceof File);
    if (file instanceof File) {
      const blob = new Blob([file], { type: 'image/png' });
      console.log('blob filename: ', file.name + '.png');
      zip.file(file.name + '.png', blob);
    } else if (typeof file === 'string') {
      zip.file(`keyword${kwIndex++}.txt`, file);
    }
  }

  zip.generateAsync({ type: 'blob' }).then((dlContent) => {
    const url = window.URL.createObjectURL(dlContent);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  });
}

function saveAsTextFile(text: string) {
  const data = new Blob([text], { type: 'text/plain' });
  const textFile = URL.createObjectURL(data);

  const link = document.createElement('a');
  link.href = textFile;
  link.download = 'output.txt';
  link.click();

  URL.revokeObjectURL(textFile);
  link.remove();
}

async function getImagesFromPrompts(
  promptFile: File,
  { debugMessages, setDebugMessages }: debugContextType
) {
  const prompts = await getPromptsArray(promptFile);
  const imgFiles: File[] = [];

  for (let promptIndex = 0; promptIndex < prompts.length; promptIndex++) {
    const initClient = promptIndex === 0;
    const closeClient = promptIndex === prompts.length - 1;
    const prompt = prompts[promptIndex];

    createDebug(
      `Creating image for prompt: ${prompt}...`,
      'normal',
      debugMessages,
      setDebugMessages
    );

    const response1 = await fetch('/api/midjourney', {
      method: 'POST',
      body: JSON.stringify({ prompt, initClient, closeClient }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response1.json();
    console.log(data);

    if (!response1.ok) {
      createDebug(
        `${data.errorMessage}, skipping...`,
        'error',
        debugMessages,
        setDebugMessages
      );
      continue;
    }

    const { images }: { images: MJMessage[] } = data;

    console.log(images);

    for (let upScaleIndex = 0; upScaleIndex < images.length; upScaleIndex++) {
      const upScale = images[upScaleIndex];
      const imgURL = upScale.proxy_url as string;
      const response2 = await fetch(imgURL);
      const blob = await response2.blob();
      const date = new Date();
      const file = new File([blob], `${date.getTime().toString()}`, {
        type: 'image/png',
      });
      imgFiles.push(file);
    }

    createDebug(
      `Created upscale images for: ${prompts[promptIndex]} (${images.length} upscaled images)`,
      'normal',
      debugMessages,
      setDebugMessages
    );
  }

  return imgFiles;
}

async function getKeywordFromImages(
  files: File[],
  keywordCount: string,
  { debugMessages, setDebugMessages }: debugContextType
): Promise<string[]> {
  const keywords: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();

    const file = files[i];
    formData.append(file.name, file, file.name);

    const response = await fetch('/api/gemini', {
      headers: {
        keywordCount: keywordCount,
      },
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      keywords.push(file.name + '\n' + data.text.replace(/\*/g, ''));
      createDebug(
        `Created keyword for: ${file.name}`,
        'normal',
        debugMessages,
        setDebugMessages
      );
    } else {
      createDebug(data.errorMessage, 'error', debugMessages, setDebugMessages);
    }
  }

  return keywords;
}

export default function SubmitButton() {
  const { files, setFiles } = useFileContext();
  const { keywordCount, setKeywordCount } = useSettingContext();
  const { debugMessages, setDebugMessages } = useDebugContext();

  const debugContext: debugContextType = {
    debugMessages,
    setDebugMessages,
  };

  const onSubmit = async (ev: any, debugContext: debugContextType) => {
    if (parseInt(keywordCount) <= 0) {
      createDebug(
        'Invalid keyword count.',
        'error',
        debugMessages,
        setDebugMessages
      );
      return;
    }

    let keywords: string[] = [];
    let images: File[] = [];

    for (let file of files) {
      if (file.type.startsWith('text/')) {
        const imagesFile = await getImagesFromPrompts(file, debugContext);
        images = images.concat(imagesFile);

        const keyword = await getKeywordFromImages(
          imagesFile,
          keywordCount,
          debugContext
        );
        keywords = keywords.concat(keyword);
      } else if (file.type.startsWith('image/')) {
        const keyword = await getKeywordFromImages(
          [file],
          keywordCount,
          debugContext
        );
        keywords = keywords.concat(keyword);
      }
    }

    const joinedFiles: (File | string)[] = [...images, ...keywords];
    saveAsZipFiles(joinedFiles);

    if (keywords.length !== 0) {
      const joinedKeywords = keywords.join('');
      saveAsTextFile(joinedKeywords);
      createDebug(
        'Generation completed.',
        'success',
        debugMessages,
        setDebugMessages
      );
    } else {
      createDebug(
        'No keyword generated for current image.',
        'error',
        debugMessages,
        setDebugMessages
      );
    }

    setFiles([]);
  };

  return (
    <button
      className={styles.submitButton}
      onClick={(ev) => onSubmit(ev, debugContext)}>
      Automate
    </button>
  );
}
