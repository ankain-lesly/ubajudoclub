/**
 * Cloudinary Media Integration for UBa Judo Club
 * Pure upload helper — callers are responsible for compressing images via `compress.ts`
 * before passing files to `uploadToCloudinary`.
 * All Cloudinary URL optimization/transformation params are intentionally disabled
 * so uploaded URLs remain clean and unmodified (see TODO.md for archived params).
 */

import { env } from "@/lib/env";

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: "image" | "video";
  width?: number;
  height?: number;
  bytes?: number;
  thumbnail_url: string;
}

export function getCloudinaryCloudName(): string {
  return env.cloudinaryCloudName;
}

export function getCloudinaryUploadPreset(): string {
  return env.cloudinaryUploadPreset;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(getCloudinaryCloudName() && getCloudinaryUploadPreset());
}

/**
 * Checks whether a given URL points to a video resource.
 */
export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.includes("/video/upload/") ||
    clean.endsWith(".mp4") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".avi") ||
    clean.endsWith(".mkv")
  );
}
/**
 * Uploads a file directly to Cloudinary using an unsigned upload preset.
 * Pure uploader: compress images via `compress.ts` on the caller side before calling.
 */
export async function uploadToCloudinary(
  file: File,
  options?: {
    folder?: string;
    caption?: string;
  }
): Promise<CloudinaryUploadResponse> {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!cloudName) {
    throw new Error(
      "Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your environment."
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (options?.folder) {
    formData.append("folder", options.folder);
  }
  if (options?.caption) {
    formData.append("context", `caption=${options.caption}`);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    let message = "Cloudinary upload failed";
    try {
      const parsed = JSON.parse(errText);
      message = parsed.error?.message || message;
    } catch {
      message = `${message}: ${response.statusText}`;
    }
    throw new Error(message);
  }

  const data = await response.json();
  const resourceType = (data.resource_type === "video" ? "video" : "image") as
    | "image"
    | "video";

  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    format: data.format,
    resource_type: resourceType,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
    thumbnail_url: data.secure_url,
  };
}
