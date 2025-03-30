
import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TransformedImage from '@/components/TransformedImage';
import { transformImage } from '@/services/openaiService';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('openai_api_key', newKey);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage) return;
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please enter your OpenAI API key first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await transformImage(originalImage);
      setTransformedImage(result);
      toast({
        title: "Success!",
        description: "Your image has been transformed to Ghibli style",
      });
    } catch (error) {
      console.error('Image transformation failed', error);
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
    <div className="min-h-screen bg-[#e6f3ff] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#3a7ca5]">
          Ghibli Art Style Transformer
        </h1>
        
        {/* API Key Input */}
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your OpenAI API key"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#3a7ca5] focus:border-[#3a7ca5]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
        
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
            {isLoading ? 'Transforming...' : 'Transform to Ghibli Style'}
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
