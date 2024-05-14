'use client';

import { useRef, useState } from 'react';
import styles from '../../../components/DragAndDrop.module.css';
import Image from 'next/image';
import fs from 'fs';

function downloadFile(text: string) {
  const data = new Blob([text], { type: 'image/jpg' });
  const textFile = URL.createObjectURL(data);

  const link = document.createElement('a');
  link.href = textFile;
  link.download = 'output.jpg';
  link.click();

  URL.revokeObjectURL(textFile);
  link.remove();
}

async function printExif(fileURL: string) {}

export default function DragAndDrop() {
  const [files, setFiles] = useState<File[]>([]);
  console.log(files);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);

  if (files.length !== 0) {
    const fileReader = new FileReader();
    fileReader.onload = function (ev) {
      console.log(ev.target?.result);
      printExif(ev?.target?.result as string);
    };
    fileReader.readAsDataURL(files[0]);
  }

  const handleChange = (ev: any) => {
    ev.preventDefault();

    if (ev.target.files && ev.target.files[0]) {
      for (let i = 0; i < ev.target.files['length']; i++) {
        setFiles((prevState: File[]) => [...prevState, ev.target.files[i]]);
      }
    }
  };

  const handleDragEnter = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragActive(true);
  };

  const handleDragOver = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (ev: any) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragActive(false);
    console.log('dropped');

    if (ev.target.files && ev.target.files[0]) {
      for (let i = 0; i < ev.target.files['length']; i++) {
        setFiles((prevState: File[]) => [...prevState, ev.target.files[i]]);
      }
    }
  };

  const openFileExplorer = () => {
    inputRef.current.value = '';
    inputRef.current.click();
  };

  return (
    <div className={styles.outline}>
      <form
        className={`${dragActive ? styles.form_dragging : styles.form}`}
        onSubmit={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <input
          className={styles.hidden}
          type="file"
          placeholder="fileInput"
          multiple={true}
          accept="image/*,.txt"
          ref={inputRef}
          onChange={handleChange}
        />
        <Image
          alt="upload imgs"
          src="/upload_folder.png"
          width="70"
          height="70"
        />
        <p style={{ marginBottom: '20px' }}>
          Drag & drop files here or{' '}
          <span onClick={openFileExplorer}>
            <u className={styles.select_files}>select files</u>
          </span>
        </p>
      </form>
      {/* <div className={styles.image_preview_outline}>
        {files.length !== 0 && (
          <Image alt="placeholder" src={files[0]} width={50} height={50} />
        )}
      </div> */}
    </div>
  );
}
