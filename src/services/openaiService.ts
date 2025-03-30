
import { useToast } from "@/hooks/use-toast";

// Base64 image data format expected by OpenAI API
interface OpenAIImageResponse {
  data: {
    url: string;
  }[];
}

export const transformImage = async (imageData: string): Promise<string> => {
  try {
    // Extract base64 data from the data URL
    const base64Image = imageData.split(',')[1];
    
    // Create the OpenAI API request
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: "Transform this image into Studio Ghibli art style. Make it look like it was drawn by Hayao Miyazaki with soft colors, detailed backgrounds, and the magical whimsical feeling of Studio Ghibli films. Keep the main subject and composition the same.",
        n: 1,
        size: "1024x1024",
        response_format: "url",
        quality: "standard",
        // Send the image as base64
        image: base64Image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to transform image');
    }

    const responseData: OpenAIImageResponse = await response.json();
    return responseData.data[0].url;
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  }
};
