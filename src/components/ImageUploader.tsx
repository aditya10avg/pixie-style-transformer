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
      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 hover:border-blue-400 
                      transition-colors bg-blue-50/50 cursor-pointer">
        <input
          type="file"
          onChange={onDrop}
          accept="image/*"
          className="hidden"
          {...getRootProps()}
        />
        <div className="text-center space-y-4">
          <div className="text-blue-500">
            <svg className="mx-auto h-12 w-12" /* ... svg path ... */ />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">
              Drop your image here, or click to select
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
