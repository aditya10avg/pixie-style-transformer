
import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TransformedImage from '@/components/TransformedImage';
import { transformImage } from '@/services/openaiService';
import { convertToGrayscaleSketch } from '@/utils/imageProcessing';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setOriginalImage(imageData);
      
      // Process image to create sketch
      setIsProcessing(true);
      try {
        const sketch = await convertToGrayscaleSketch(imageData);
        setSketchImage(sketch);
        toast({
          title: "Image Processed",
          description: "Your image has been converted to a sketch and is ready for transformation",
        });
      } catch (error) {
        toast({
          title: "Processing Failed",
          description: "Failed to convert image to sketch",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTransform = async () => {
    if (!originalImage || !sketchImage) return;
    
    setIsLoading(true);
    try {
      const result = await transformImage(originalImage, sketchImage);
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
        
        <ImageUploader 
          onImageUpload={handleImageUpload} 
          originalImage={originalImage}
        />
        
        {isProcessing && (
          <div className="mt-4 text-center text-gray-600">
            Converting to sketch...
          </div>
        )}
        
        {sketchImage && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Grayscale Sketch</h2>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={sketchImage} 
                alt="Grayscale Sketch" 
                className="w-full object-contain max-h-[200px]" 
              />
            </div>
            <button 
              onClick={handleTransform}
              disabled={isLoading}
              className="w-full mt-4 bg-[#3a7ca5] text-white py-2 rounded-md hover:bg-[#2c5f7e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Transforming...' : 'Transform to Ghibli Style'}
            </button>
          </div>
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
