import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const CVUploader: React.FC = () => {
  const [fileName, setFileName] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = async () => {
        // if (event.target?.result) {
        //   const arrayBuffer = event.target.result as ArrayBuffer;
        //   const extractedText = await extractText(file, arrayBuffer);
        //   onExtract(extractedText);
        // }
      };

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        reader.readAsArrayBuffer(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        reader.readAsArrayBuffer(file);
      } else {
        alert('Format file tidak didukung. Gunakan PDF atau DOCX.');
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="p-4 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer min-h-32 bg-white/90 grid place-content-center"
    >
      <input {...getInputProps()} name="file" className="h-full" />
      <p>Drag & drop CV (PDF/DOCX) here, or click to select file.</p>
      {fileName && <p className="mt-2 font-bold text-2xl">{fileName}</p>}
    </div>
  );
};

export default CVUploader;
