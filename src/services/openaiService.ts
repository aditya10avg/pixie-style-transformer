// Base64 image data format expected by OpenAI API
interface OpenAIImageResponse {
  data: {
    url: string;
  }[];
}

interface GPTVisionResponse {
  choices: [{
    message: {
      content: string;
    }
  }];
}

// Replace this with a regular OpenAI API key (starts with 'sk-')
const OPENAI_API_KEY = "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";

export const analyzeImageWithGPT4Vision = async (imageData: string): Promise<string> => {
  try {
    const base64Image = imageData.split(',')[1] || imageData;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Describe the content of the image in detail, focusing on composition, subjects, colors, and mood."
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze image with GPT-4 Vision');
    }

    const data: GPTVisionResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const generateGhibliImage = async (description: string): Promise<string> => {
  try {
    const ghibliPrompt = `Create a Studio Ghibli style image of the following scene: ${description}. 
    Use the signature Ghibli art style with soft pastel colors, detailed backgrounds, 
    and magical whimsical feeling typical of films like Spirited Away or My Neighbor Totoro.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: ghibliPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const responseData: OpenAIImageResponse = await response.json();
    return responseData.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
