export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

// Compresses to max 1600px and JPEG 0.75 to stay under localStorage/Redis quotas
export function fileToCompressedDataUrl(file, maxSide = 1600, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          const scale = maxSide / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for photos — much smaller than PNG data URLs
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function parsePhotoInput(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}
