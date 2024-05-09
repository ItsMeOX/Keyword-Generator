import { MJMessage } from 'midjourney';
import { useFileContext } from '@/app/contexts/FileContext';
import styles from './SubmitButton.module.css';
import React from 'react';
import fs from 'fs';

function downloadTextFile(text: string) {
  const data = new Blob([text], { type: 'text/plain' });
  const textFile = URL.createObjectURL(data);

  const link = document.createElement('a');
  link.href = textFile;
  link.download = 'output.txt';
  link.click();

  URL.revokeObjectURL(textFile);
  link.remove();
}

function arrayBufferToString(arrayBuffer: ArrayBuffer) {
  const decoder = new TextDecoder('utf-8');
  const arr = new Uint8Array(arrayBuffer);
  const str = decoder.decode(arr);
  return str;
}

function getPromptsArray(promptFile: File): Promise<string[]> {
  // Get a list of string splitted by '\n'
  return new Promise((resolve, reject) => {
    if (promptFile?.size === 0) resolve([]);

    const fileReader = new FileReader();
    let promptsArray: string[];

    fileReader.onload = (event) => {
      let prompts = event!.target!.result;
      if (prompts instanceof ArrayBuffer) {
        prompts = arrayBufferToString(prompts);
      }

      promptsArray = prompts!.split('\n');

      promptsArray = promptsArray.filter((str) => {
        return str.trim().length !== 0;
      });

      resolve(promptsArray);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsText(promptFile);
  });
}

async function getImagesFromPrompts(promptFile: File) {
  const prompts = await getPromptsArray(promptFile);
  const imgFiles: File[] = [];

  const response = await fetch('/api/midjourney', {
    method: 'POST',
    body: JSON.stringify({ prompts }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log(data);

  const { upScales }: { upScales: MJMessage[] } = data;

  console.log('upScales: ');
  console.log(upScales);

  if (upScales?.length === 0) {
    console.log('No returned upscale content.');
  }

  for (let upScale of upScales) {
    const imgURL = upScale.proxy_url as string;
    const response = await fetch(imgURL);
    const blob = await response.blob();
    const file = new File([blob], upScale.id as string, { type: 'image/png' });
    imgFiles.push(file);
  }

  console.log('imgFiles: ');
  console.log(imgFiles);

  return imgFiles;
}

async function getKeywordFromImages(files: File[]): Promise<string[]> {
  const keywords: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();

    const file = files[i];
    formData.append(file.name, file, file.name);

    const response = await fetch('/api/gemini', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      keywords.push(data.text);
    } else {
      console.log('Error from Gemini.');
    }
  }

  return keywords;
}

export default function SubmitButton() {
  const { files, setFiles } = useFileContext();

  const onSubmit = async (ev: any) => {
    let keywords: string[] = [];

    for (let file of files) {
      if (file.type.startsWith('text/')) {
        const imagesFile = await getImagesFromPrompts(file);
        const keyword = await getKeywordFromImages(imagesFile);
        keywords = keywords.concat(keyword);
      } else if (file.type.startsWith('image/')) {
        const keyword = await getKeywordFromImages([file]);
        keywords = keywords.concat(keyword);
        console.log(keywords);
      }
    }

    if (keywords.length !== 0) {
      const joinedKeywords = keywords.join('');
      downloadTextFile(joinedKeywords);
    } else {
      console.log('no keyword');
    }

    setFiles([]);
  };

  return (
    <button className={styles.submitButton} onClick={onSubmit}>
      Automate
    </button>
  );
}
