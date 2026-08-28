export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function parsePhotoInput(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}
