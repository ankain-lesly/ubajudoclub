/**
 * Client-Side Image Compression Utility (Sole Compression Medium)
 *
 * Uses `react-image-file-resizer` to downscale and compress photos before upload
 * while strictly preserving original aspect ratio and orientation across
 * portrait (3:4, 9:16), landscape (4:3, 16:9), and square (1:1) images.
 *
 * Symmetric 1600x1600 bounding box @ quality 85:
 * - Landscape 4:3  (4032x3024) -> 1600x1200
 * - Landscape 16:9 (3840x2160) -> 1600x900
 * - Portrait  3:4  (3024x4032) -> 1200x1600
 * - Portrait  9:16 (2268x4032) -> 900x1600
 * - Leaves videos, SVGs, and animated GIFs untouched.
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  format?: "JPEG" | "PNG" | "WEBP";
  quality?: number; // 0 to 100
}

const DEFAULT_MAX_WIDTH = 1600;
const DEFAULT_MAX_HEIGHT = 1600;
const DEFAULT_QUALITY = 85;
const DEFAULT_FORMAT = "JPEG" as const;

function shouldSkipCompression(file: File): boolean {
  if (!file || !file.type.startsWith("image/")) {
    return true;
  }
  const lowerName = file.name.toLowerCase();
  const isSvg = file.type === "image/svg+xml" || lowerName.endsWith(".svg");
  const isGif = file.type === "image/gif" || lowerName.endsWith(".gif");
  return isSvg || isGif;
}

/**
 * Resizes and compresses one or more image files using `react-image-file-resizer`.
 * Preserves aspect ratio for both portrait and landscape images without distortion.
 * Returns a single `File` when given a single `File`, or a `FileList` for arrays.
 */
export async function handleImageResizing(
  files: File | File[] | null,
  settings?: Omit<ResizeOptions, "outputType">
): Promise<File | FileList> {
  // SSR guard
  if (typeof window === "undefined") {
    if (!files) return [] as unknown as FileList;
    return Array.isArray(files) ? (files as unknown as FileList) : files;
  }

  if (!files) {
    return new DataTransfer().files;
  }

  const fileArray = Array.isArray(files) ? Array.from(files) : [files];
  if (fileArray.length === 0) {
    return new DataTransfer().files;
  }

  const maxWidth = settings?.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = settings?.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const quality = settings?.quality ?? DEFAULT_QUALITY;

  // Dynamic import keeps `react-image-file-resizer` (browser/FileReader CJS) SSR-safe
  const resizerModule = await import("react-image-file-resizer");
  const Resizer =
    (resizerModule.default as unknown as { default?: typeof resizerModule.default })
      ?.default ?? resizerModule.default;

  const processedFiles: File[] = [];

  for (const file of fileArray) {
    if (shouldSkipCompression(file)) {
      processedFiles.push(file);
      continue;
    }

    const format =
      settings?.format ??
      (file.type === "image/png" ? "PNG" : DEFAULT_FORMAT);

    try {
      const resizedBlob = await new Promise<Blob>((resolve, reject) => {
        try {
          Resizer.imageFileResizer(
            file,
            maxWidth,
            maxHeight,
            format,
            quality,
            0,
            (resized) => {
              if (resized instanceof Blob) {
                resolve(resized);
              } else {
                reject(new Error("Resizer did not return a Blob"));
              }
            },
            "blob"
          );
        } catch (err) {
          reject(err);
        }
      });

      // Keep original if compression somehow produced a larger payload
      if (resizedBlob.size >= file.size) {
        processedFiles.push(file);
        continue;
      }

      const ext =
        format === "PNG" ? "png" : format === "WEBP" ? "webp" : "jpg";
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const outputName = `${baseName}.${ext}`;

      const compressedFile = new File([resizedBlob], outputName, {
        type: resizedBlob.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
        lastModified: file.lastModified,
      });

      const savedPercent = Math.round(
        (1 - compressedFile.size / file.size) * 100
      );
      console.info(
        `[PreUploadCompression] "${file.name}": ${(file.size / 1024 / 1024).toFixed(2)} MB -> ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)} MB (${savedPercent}% saved)`
      );

      processedFiles.push(compressedFile);
    } catch (error) {
      console.error("[PreUploadCompression] Error resizing image:", file.name, error);
      // Fall back to original file at the same index so batches never misalign
      processedFiles.push(file);
    }
  }

  const dataTransfer = new DataTransfer();
  processedFiles.forEach((f) => dataTransfer.items.add(f));

  return Array.isArray(files) ? dataTransfer.files : dataTransfer.files[0];
}

/**
 * Convenience wrapper for single-file upload pipelines (`cloudinary.ts`, `storage.ts`).
 */
export async function compressImageBeforeUpload(
  file: File,
  options?: ResizeOptions
): Promise<File> {
  if (typeof window === "undefined" || shouldSkipCompression(file)) {
    return file;
  }

  const result = await handleImageResizing(file, options);
  return result instanceof File ? result : file;
}
