export async function readFileAsBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  let binary = '';

  const bytes = new Uint8Array(arrayBuffer);

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export async function getImageSrc(file: File): Promise<string> {
  const base64String = await readFileAsBase64(file);
  const mimeType = file.type;
  const imageUrl = `data:${mimeType};base64,${base64String}`;

  return imageUrl;
}
