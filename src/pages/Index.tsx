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
        
        {/* Add contact info section at the bottom */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            For feedback or support, reach out to:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            <a 
              href="mailto:adityavg1005@gmail.com"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              adityavg1005@gmail.com
            </a>
            <a 
              href="https://www.linkedin.com/in/aditya-gayakwad-ba993026a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a 
              href="https://x.com/avg_aditya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X.com
            </a>
          </div>
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
