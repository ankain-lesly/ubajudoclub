/**
 * Cloudinary Media Integration for UBa Judo Club
 * Handles media uploads, automatic compression, video posters,
 * and Open Graph (1200x630) social preview card generation.
 */

import { env } from "@/lib/env";
import { compressImageBeforeUpload } from "./compress";

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: "image" | "video";
  width?: number;
  height?: number;
  bytes?: number;
  thumbnail_url: string;
  og_image_url: string;
}

export function getCloudinaryCloudName(): string {
  return env.cloudinaryCloudName;
}

export function getCloudinaryUploadPreset(): string {
  return env.cloudinaryUploadPreset;
}

export function isCloudinaryConfigured(): boolean {
  const data = [getCloudinaryCloudName(), getCloudinaryUploadPreset()]

  console.log({data})
  
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
 * Transforms a Cloudinary secure_url into an Open Graph preview card (1200x630).
 * Fits WhatsApp (<300KB), Twitter, Facebook, and LinkedIn specifications.
 */
export function getOgImageUrl(
  url?: string | null,
  resourceType: string = "image"
): string {
  if (!url) return "";

  const isVideo = (resourceType || "").toUpperCase() === "VIDEO";

  // If it's a Cloudinary secure_url, apply smart fill crop
  if (url.includes("res.cloudinary.com")) {
    if (isVideo || url.includes("/video/upload/")) {
      // For videos, extract frame 0 (so_0) as a JPEG card
      return url
        .replace(
          /\/video\/upload\/(?:v\d+\/)?/,
          "/video/upload/c_fill,g_auto,w_1200,h_630,so_0,q_auto,f_jpg/"
        )
        .replace(/\.[^/.]+$/, ".jpg");
    }

    // For images, apply smart fill crop with AI gravity and JPEG output
    return url.replace(
      /\/image\/upload\/(?:v\d+\/)?/,
      "/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/"
    );
  }

  // Fallback to original url as-is
  return url;
}

/**
 * Builds a fast, responsive thumbnail (400x300) from a Cloudinary secure_url.
 */
export function getMediaThumbnailUrl(
  url?: string | null,
  resourceType: string = "image"
): string {
  if (!url) return "";

  const isVideo = (resourceType || "").toUpperCase() === "VIDEO";

  if (url.includes("res.cloudinary.com")) {
    if (isVideo || url.includes("/video/upload/")) {
      return url
        .replace(
          /\/video\/upload\/(?:v\d+\/)?/,
          "/video/upload/c_fill,w_400,h_300,so_0,q_auto,f_jpg/"
        )
        .replace(/\.[^/.]+$/, ".jpg");
    }

    return url.replace(
      /\/image\/upload\/(?:v\d+\/)?/,
      "/image/upload/c_fill,w_400,h_300,q_auto,f_auto/"
    );
  }

  return url;
}

/**
 * Uploads a file directly to Cloudinary using an unsigned upload preset.
 * Automatically compresses large photos client-side before network dispatch.
 */
export async function uploadToCloudinary(
  rawFile: File,
  options?: {
    folder?: string;
    caption?: string;
    skipCompression?: boolean;
  }
): Promise<CloudinaryUploadResponse> {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!cloudName) {
    throw new Error(
      "Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your environment."
    );
  }

  // Automatically compress photos in browser before uploading to save bandwidth & speed up transfer
  const file = options?.skipCompression
    ? rawFile
    : await compressImageBeforeUpload(rawFile);

  const isVideo = file.type.startsWith("video/");
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
  console.log(data)
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
    thumbnail_url: getMediaThumbnailUrl(data.secure_url, resourceType),
    og_image_url: getOgImageUrl(data.secure_url, resourceType),
  };
}
