import React from 'react';
import { useDropzone } from 'react-dropzone';

const CVUploader: React.FC = () => {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    maxFiles: 1,
  });

  const fileName = acceptedFiles.length > 0 ? acceptedFiles[0].name : '';

  return (
    <>
      <div
        {...getRootProps()}
        className="p-4 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer min-h-32 bg-white/90 grid place-content-center"
      >
        <input {...getInputProps()} name="file" className="h-full" />
        <p>Select CV (PDF/DOCX)</p>
        {fileName && <p className="mt-2 font-bold text-2xl">{fileName}</p>}
      </div>
    </>
  );
};

export default CVUploader;
