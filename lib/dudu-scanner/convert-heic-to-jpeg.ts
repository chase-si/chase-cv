export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const { heicTo } = await import("heic-to/next");
  return heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.9,
  });
}
