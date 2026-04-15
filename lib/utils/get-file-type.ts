/**
 * Returns the file extension without dot, lowercased.
 * Example: "photo.JPG" -> "jpg"
 */
export function getFileType(fileName: string): string | null {
  const idx = fileName.lastIndexOf('.');
  if (idx === -1) return null;
  const ext = fileName.slice(idx + 1).trim().toLowerCase();
  if (!ext) return null;
  return ext;
}

