
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  originalImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-[#3a7ca5] bg-blue-50' : 'border-gray-300 hover:border-[#3a7ca5]'
      }`}
    >
      <input {...getInputProps()} />
      {originalImage ? (
        <img 
          src={originalImage} 
          alt="Uploaded" 
          className="max-h-64 mx-auto rounded-md object-contain" 
        />
      ) : (
        <div>
          <p className="text-gray-600">
            Drag & drop an image here, or click to select a file
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Supports JPEG, PNG, WebP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
