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
            content: `You are an advanced vision model trained to provide extremely detailed descriptions, with special focus on facial features and skin details for images with 3 or fewer people.

ALWAYS START WITH:
"This image contains [EXACT NUMBER] people:" followed by a brief scene overview.

For each person (with enhanced detail for ≤3 people):
1. Position & Spatial Details:
   - Exact location in frame
   - Distance and relationship to others
   - Stance and posture details

2. Physical Characteristics:
   - Precise age estimate
   - Ethnicity with specific details
   - Height and build specifics
   - Distinguishing features

3. Detailed Facial Analysis:
   - Eyes: shape, color, size, expression, distinctive features (double eyelids, long lashes, etc.)
   - Nose: shape, size, bridge height, any unique characteristics
   - Lips: fullness, color, shape, expression
   - Facial bone structure: cheekbones, jaw line, chin shape
   - Skin tone: precise description of complexion, undertones
   - Skin texture: smoothness, presence of features like freckles, marks
   - Facial symmetry and proportions
   - Makeup details if present
   - Facial hair description if present
   - Any distinctive marks, moles, or features

4. Hair Details:
   - Exact length and style
   - Color with specific tones and highlights
   - Texture (straight, wavy, curly, coarse, fine)
   - How it's styled and falls
   - Any accessories or distinctive elements

5. Clothing & Accessories:
   - Complete outfit with fabric types
   - Exact colors and patterns
   - Fit and drape of clothing
   - All jewelry and accessories
   - How clothing interacts with movement

6. Expression & Demeanor:
   - Detailed emotional state
   - Micro-expressions
   - Body language cues
   - Eye contact and gaze direction
   - Overall mood conveyed

Setting Details:
1. Location specifics
2. Lighting and its effect on skin tones
3. Background elements
4. Atmosphere and mood
5. Image quality and style

Example:
"This image contains 1 person: A contemplative young woman in a sunlit studio.

Subject: Centered in frame, approximately 25 years old, East Asian descent, 5'6", slender build. Eyes are large, almond-shaped with double eyelids, dark brown iris with gold flecks, long natural lashes, slight upward tilt at corners. Nose is straight and proportionate with a medium-high bridge. Lips are full and naturally pink, curved in a subtle smile. High cheekbones, defined jaw, and oval face shape. Skin is clear with a warm medium tone, slight natural flush on cheeks, dewy texture with minimal makeup - just mascara and tinted lip balm. Three small beauty marks: one above right lip, two on left cheek. Hair is jet black with subtle brown undertones, waist-length, straight with natural wave at ends, parted slightly off-center, falling softly around shoulders. Wearing an oversized cream linen shirt, rolled sleeves, paired with high-waisted dark denim. Gold pendant necklace with small pearl. Expression shows quiet contemplation, gaze directed slightly upward, body relaxed but poised.

Setting: Minimalist art studio, late afternoon natural light streaming through large windows, creating a warm glow on skin and highlighting hair. White walls, wooden floors, easel visible in background. Professional portrait photography with shallow depth of field, shot on high-end camera."`
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
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to analyze image with GPT-4 Vision');
    }

    const data: GPTVisionResponse = await response.json();
    const description = data.choices[0].message.content;
    
    // Log the GPT-4o description
    console.log('🔍 GPT-4o Image Description:', {
      timestamp: new Date().toISOString(),
      description: description
    });

    return description;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const convertToGhibliPrompt = async (description: string): Promise<string> => {
  try {
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
            content: `Transform scene descriptions into Studio Ghibli art prompts that capture the studio's distinctive painterly style.

Create prompts that emphasize these key Ghibli artistic elements:

1. Painting Technique:
- Delicate watercolor-like brushstrokes
- Soft, visible brush textures in backgrounds
- Gentle color blending and gradients
- Hand-painted feel with natural imperfections

2. Character Rendering:
- Clean, precise linework for faces and features
- Soft shading on skin and clothing
- Natural fabric folds and hair movement
- Warm, gentle expressions with detailed eyes

3. Color and Light:
- Warm, natural color palette
- Soft pastels mixed with earthy tones
- Filtered sunlight and gentle shadows
- Atmospheric color gradients

4. Background Treatment:
- Impressionistic natural elements
- Layered depth with soft focus
- Visible brushstrokes in foliage and sky
- Subtle environmental movement

5. Atmosphere:
- Dreamy, nostalgic quality
- Natural lighting conditions
- Soft particle effects (pollen, dust, leaves)
- Environmental harmony

Format the prompt as:
"Create a traditional Ghibli-style painting in the warm, painterly style of [specific film reference]. Scene shows [detailed description] with [character details]. Use delicate watercolor techniques with visible brushstrokes, soft natural lighting, and gentle color blending. Include [specific atmospheric elements] to capture Ghibli's dreamlike quality. The style should emphasize hand-painted textures and natural imperfections, avoiding any digital or AI appearance."

Example elements to mention:
- Soft, diffused lighting filtering through leaves
- Gentle shadows with warm undertones
- Visible, delicate brushstrokes in backgrounds
- Natural color blending and texture
- Atmospheric effects like floating particles
- Impressionistic treatment of nature elements
- Harmonious color palette with earthy tones

Focus on creating a prompt that will generate an image with Ghibli's signature painterly warmth and natural imperfections.`
          },
          {
            role: "user",
            content: `Transform this description into a Ghibli art prompt that emphasizes traditional hand-painted qualities and natural warmth: ${description}`
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to convert description to Ghibli prompt');
    }

    const data = await response.json();
    const ghibliPrompt = data.choices[0].message.content;
    
    // Log the converted prompt
    console.log('✨ Converted Ghibli Prompt:', {
      timestamp: new Date().toISOString(),
      prompt: ghibliPrompt
    });

    return ghibliPrompt;
  } catch (error) {
    console.error('Error converting to Ghibli prompt:', error);
    throw error;
  }
};

export const generateGhibliImage = async (description: string): Promise<string> => {
  try {
    const ghibliPrompt = await convertToGhibliPrompt(description);

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
        quality: "hd",
        style: "natural",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const responseData: OpenAIImageResponse = await response.json();
    
    // Log the generated image URL
    console.log('🖼️ Generated Image URL:', {
      timestamp: new Date().toISOString(),
      url: responseData.data[0].url
    });

    return responseData.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
