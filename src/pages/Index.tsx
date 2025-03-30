import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TransformedImage from '@/components/TransformedImage';
import { analyzeImageWithGPT4Vision, generateGhibliImage } from '@/services/openaiService';
import { useToast } from "@/hooks/use-toast";
import LoadingAnimation from '@/components/LoadingAnimation';

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setOriginalImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage) return;
    
    setIsLoading(true);
    try {
      // Step 1: Analyze image with GPT-4 Vision
      const description = await analyzeImageWithGPT4Vision(originalImage);
      
      // Step 2: Generate Ghibli-style image
      const ghibliImage = await generateGhibliImage(description);
      
      setTransformedImage(ghibliImage);
      toast({
        title: "Success!",
        description: "Your image has been transformed to Ghibli style",
      });
    } catch (error) {
      console.error('Image transformation failed:', error);
      toast({
        title: "Transformation Failed",
        description: error instanceof Error ? error.message : "An error occurred while transforming the image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#fef3c7] p-8">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] bg-clip-text text-transparent">
          Image to Art Generator
        </h1>
        
        <div className="space-y-8">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            originalImage={originalImage}
          />
          
          {originalImage && (
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg
                       hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02] transition-all
                       disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed
                       font-semibold shadow-lg"
              onClick={handleTransform}
              disabled={isLoading}
            >
              {isLoading ? 'Creating your masterpiece... (this may take up to 30 seconds)' : 'Transform to Art'}
            </button>
          )}
          
          {transformedImage && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <TransformedImage 
                transformedImage={transformedImage} 
              />
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};

export default Index;
