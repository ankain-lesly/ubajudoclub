/**
 * Client-Side Image Compression Utility
 *
 * Uses HTML5 Canvas / createImageBitmap to downscale high-resolution phone/camera photos
 * and compress them to WebP/JPEG before uploading over the network.
 *
 * - Drops 10–25 MB iPhone/Android photos down to ~300–800 KB in 100–200ms.
 * - Caps max dimension at 2048px (high-res retina standard).
 * - Leaves videos, SVGs, and animated GIFs untouched.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 to 1.0
  mimeType?: "image/webp" | "image/jpeg";
}

/**
 * Compresses an image File in the browser prior to network transmission.
 * Returns the original file if running on the server (SSR), if not an image,
 * or if compression fails.
 */
export async function compressImageBeforeUpload(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // SSR guard or non-image files
  if (typeof window === "undefined" || !file || !file.type.startsWith("image/")) {
    return file;
  }

  // Do not recompress vector graphics or animated GIFs
  const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
  const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
  if (isSvg || isGif) {
    return file;
  }

  const maxWidth = options.maxWidth ?? 2048;
  const maxHeight = options.maxHeight ?? 2048;
  const quality = options.quality ?? 0.82;
  const mimeType = options.mimeType ?? "image/jpeg";

  try {
    let width = 0;
    let height = 0;
    let bitmap: ImageBitmap | null = null;
    let htmlImg: HTMLImageElement | null = null;

    if (typeof createImageBitmap !== "undefined") {
      try {
        bitmap = await createImageBitmap(file);
        width = bitmap.width;
        height = bitmap.height;
      } catch {
        bitmap = null;
      }
    }

    if (!bitmap) {
      htmlImg = await loadHtmlImage(file);
      width = htmlImg.naturalWidth || htmlImg.width;
      height = htmlImg.naturalHeight || htmlImg.height;
    }

    // If image is already smaller than 500KB and within target dimensions, skip compression
    if (file.size < 500 * 1024 && width <= maxWidth && height <= maxHeight) {
      if (bitmap) bitmap.close();
      return file;
    }

    // Calculate aspect-ratio scale
    let scale = 1;
    if (width > maxWidth || height > maxHeight) {
      scale = Math.min(maxWidth / width, maxHeight / height);
    }

    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      if (bitmap) bitmap.close();
      return file;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (bitmap) {
      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();
    } else if (htmlImg) {
      ctx.drawImage(htmlImg, 0, 0, targetWidth, targetHeight);
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, quality);
    });

    if (!blob) {
      return file;
    }

    // If compression somehow produced a larger file, keep the original
    if (blob.size >= file.size) {
      return file;
    }

    // Format new file name with matching extension
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const ext = mimeType === "image/webp" ? "webp" : "jpg";
    const compressedFileName = `${baseName}.${ext}`;

    const compressedFile = new File([blob], compressedFileName, {
      type: mimeType,
      lastModified: Date.now(),
    });

    const savedPercent = Math.round((1 - compressedFile.size / file.size) * 100);
    console.info(
      `[PreUploadCompression] "${file.name}": ${(file.size / 1024 / 1024).toFixed(2)} MB -> ${(
        compressedFile.size /
        1024 /
        1024
      ).toFixed(2)} MB (${savedPercent}% saved)`
    );

    return compressedFile;
  } catch (err) {
    console.warn("[PreUploadCompression] Failed, proceeding with original file:", err);
    return file;
  }
}

function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
