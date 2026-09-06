/**
 * Client-side image optimization for fast and reliable uploads.
 * If an image exceeds 2.5 MB (common with DSLR camera photos),
 * it is smoothly resized to maximum 2560px (Ultra HD) and 85% JPEG quality.
 * This prevents Vercel serverless function 4.5MB payload limits from failing uploads.
 */

export async function optimizeImageForUpload(file: File): Promise<File> {
  // If the file is already small (under 2.5 MB) and standard format, no compression needed
  if (file.size <= 2.5 * 1024 * 1024) {
    return file;
  }

  // Only optimize standard images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;

      img.onload = () => {
        const MAX_DIMENSION = 2560; // Ultra HD resolution
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Fallback to original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create a new File object with the same name
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".jpg"),
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              }
            );

            resolve(optimizedFile);
          },
          "image/jpeg",
          0.88 // High quality 88%
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}
