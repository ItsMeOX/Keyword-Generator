'use client';
import { useRef, useState } from 'react';
import styles from './DragAndDrop.module.css';
import Image from 'next/image';

export default function DragAndDrop() {
  const [files, setFiles] = useState<any>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);

  const handleChange = (ev: any) => {
    ev.preventDefault();
    console.log(ev);

    if (ev.target.files && ev.target.files[0]) {
      for (let i = 0; i < ev.target.files['length']; i++) {
        setFiles((prevState: any) => [
          ...prevState,
          URL.createObjectURL(ev.target.files[i]),
        ]);
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
        setFiles((prevState: any) => [
          ...prevState,
          URL.createObjectURL(ev.target.files[i]),
        ]);
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
          accept="image/*"
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
