
/**
 * A utility function to convert an image to a grayscale sketch
 * This is a simplified version that uses canvas to create a grayscale effect
 * In a production app, you might want to use a more sophisticated algorithm or library
 */
export const convertToGrayscaleSketch = async (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Convert to grayscale and apply sketch effect
      for (let i = 0; i < data.length; i += 4) {
        // Calculate grayscale value
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // Apply a simple edge detection for sketch effect
        // This is a simplified version - for real sketch effects, you'd use more sophisticated algorithms
        data[i] = data[i + 4] ? 255 - Math.abs(gray - (0.299 * data[i + 4] + 0.587 * data[i + 5] + 0.114 * data[i + 6])) * 3 : gray;
        data[i + 1] = data[i];
        data[i + 2] = data[i];
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
};
