
// Base64 image data format expected by OpenAI API
interface OpenAIImageResponse {
  data: {
    url: string;
  }[];
}

const OPENAI_API_KEY = "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";

export const transformImage = async (imageData: string): Promise<string> => {
  try {
    // Extract base64 data from the data URL
    const base64Image = imageData.split(',')[1];
    
    // Create the OpenAI API request
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
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
