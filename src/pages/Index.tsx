
import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TransformedImage from '@/components/TransformedImage';
import { transformImage } from '@/services/openaiService';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage) return;
    
    setIsLoading(true);
    try {
      const result = await transformImage(originalImage);
      setTransformedImage(result);
      toast({
        title: "Success!",
        description: "Your Ghibli style image has been generated",
      });
    } catch (error) {
      console.error('Image transformation failed', error);
      toast({
        title: "Transformation Failed",
        description: error instanceof Error ? error.message : "An error occurred while generating the image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f3ff] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#3a7ca5]">
          Ghibli Art Style Generator
        </h1>
        
        <ImageUploader 
          onImageUpload={handleImageUpload} 
          originalImage={originalImage}
        />
        {originalImage && (
          <button 
            onClick={handleTransform}
            disabled={isLoading}
            className="w-full mt-4 bg-[#3a7ca5] text-white py-2 rounded-md hover:bg-[#2c5f7e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Ghibli Style Image'}
          </button>
        )}
        {transformedImage && (
          <TransformedImage 
            transformedImage={transformedImage} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
