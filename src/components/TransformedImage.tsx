
import React from 'react';
import { Download } from 'lucide-react';

interface TransformedImageProps {
  transformedImage: string;
}

const TransformedImage: React.FC<TransformedImageProps> = ({ transformedImage }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = transformedImage;
    link.download = 'ghibli_transformed_image.png';
    link.click();
  };

  return (
    <div className="mt-6">
      <div className="border rounded-lg overflow-hidden shadow-md">
        <img 
          src={transformedImage} 
          alt="Ghibli Style Transformed" 
          className="w-full max-h-[400px] object-contain"
        />
      </div>
      <button 
        onClick={handleDownload}
        className="w-full mt-4 flex items-center justify-center bg-[#3a7ca5] text-white py-2 rounded-md hover:bg-[#2c5f7e] transition-colors"
      >
        <Download className="mr-2" /> Download Transformed Image
      </button>
    </div>
  );
};

export default TransformedImage;
