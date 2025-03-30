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
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 hover:border-blue-400 
                  transition-colors bg-blue-50/50 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          <div className="text-blue-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mx-auto h-12 w-12" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              {isDragActive ? 'Drop your image here...' : 'Drop your image here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WEBP (max 5MB)
            </p>
          </div>
        </div>
      </div>
      
      {originalImage && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
