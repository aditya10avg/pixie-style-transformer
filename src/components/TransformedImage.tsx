import React from 'react';

interface TransformedImageProps {
  transformedImage: string;
}

const TransformedImage: React.FC<TransformedImageProps> = ({ transformedImage }) => {
  const handleDownload = async () => {
    try {
      // Fetch the image
      const response = await fetch(transformedImage);
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Set filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `transformed-art-${timestamp}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="space-y-4">
      <img 
        src={transformedImage} 
        alt="Transformed" 
        className="w-full h-auto rounded-lg shadow-lg"
      />
      <button
        onClick={handleDownload}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 
                 text-white rounded-lg hover:from-green-700 hover:to-green-600 
                 transform hover:scale-[1.02] transition-all font-semibold shadow-lg"
      >
        Download Transformed Image
      </button>
    </div>
  );
};

export default TransformedImage;
