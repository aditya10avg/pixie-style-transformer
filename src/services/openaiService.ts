
// Base64 image data format expected by OpenAI API
interface OpenAIImageResponse {
  data: {
    url: string;
  }[];
}

// API key should ideally be stored securely, not in the frontend code
const OPENAI_API_KEY = "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";

export const transformImage = async (imageData: string, sketchData: string): Promise<string> => {
  try {
    // Extract base64 data from the sketch data URL
    const base64Image = sketchData.split(',')[1];
    
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "dall-e-2", // DALL-E 2 supports image edits
        image: base64Image,
        prompt: "Transform this sketch into Studio Ghibli art style. Add soft pastel colors, detailed backgrounds, and the magical whimsical feeling typical of Studio Ghibli films like Spirited Away or My Neighbor Totoro. Maintain the composition and subject of the original sketch.",
        n: 1,
        size: "1024x1024",
        response_format: "url"
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
