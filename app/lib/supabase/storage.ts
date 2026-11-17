import { getSupabaseBrowserClient } from "./client";
import type { SessionMedia } from "@/lib/types";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  getMediaThumbnailUrl,
} from "@/lib/media/cloudinary";
import { compressImageBeforeUpload } from "@/lib/media/compress";

export interface UploadSessionMediaOptions {
  sessionId: string;
  file: File;
  caption?: string;
}

/**
 * Upload a single photo or video. Uses Cloudinary as the primary provider
 * with automatic image compression, video poster extraction, and responsive thumbnails,
 * falling back to Supabase storage if Cloudinary is not configured.
 */
export async function uploadSessionMediaFile({
  sessionId,
  file,
  caption,
}: UploadSessionMediaOptions): Promise<SessionMedia> {
  const supabase = getSupabaseBrowserClient();
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const isVideo =
    file.type.startsWith("video/") ||
    ["mp4", "mov", "webm", "m4v", "avi", "mkv"].includes(fileExt);
  const mediaType: "IMAGE" | "VIDEO" = isVideo ? "VIDEO" : "IMAGE";
  const defaultCaption = caption || file.name.replace(/\.[^/.]+$/, "");

  // 1. Primary Provider: Cloudinary (optimizations, responsive thumbnails, OG cards)
  if (isCloudinaryConfigured()) {
    try {
      const cloudRes = await uploadToCloudinary(file, {
      folder: `ubajudo/sessions/${sessionId}`,
        caption: defaultCaption,
      });

      const { data: mediaRecord, error: dbError } = await supabase
        .from("session_media")
        .insert({
          session_id: sessionId,
          url: cloudRes.secure_url,
          public_id: cloudRes.public_id,
          thumbnail_url: cloudRes.thumbnail_url,
          media_type: cloudRes.resource_type === "video" ? "VIDEO" : "IMAGE",
          caption: defaultCaption,
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Failed to save media metadata: ${dbError.message}`);
      }

      return mediaRecord as SessionMedia;
    } catch (err: any) {
      console.error("[MediaUpload] Cloudinary upload failed:", err);
      throw new Error(`Cloudinary upload failed: ${err?.message || err}`);
    }
  }

  // console.log("Not Configured")
  // throw new Error("Not Conifgured")

  // 2. Fallback Provider: Supabase Storage Bucket
  const fileToUpload = isVideo ? file : await compressImageBeforeUpload(file);
  const cleanBaseName = fileToUpload.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const uploadExt = fileToUpload.name.split(".").pop()?.toLowerCase() || fileExt;
  const path = `${sessionId}/${Date.now()}_${cleanBaseName}.${uploadExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("session-media")
    .upload(path, fileToUpload, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("session-media").getPublicUrl(uploadData.path);

  const { data: mediaRecord, error: dbError } = await supabase
    .from("session_media")
    .insert({
      session_id: sessionId,
      url: publicUrl,
      public_id: uploadData.path,
      thumbnail_url: publicUrl,
      media_type: mediaType,
      caption: defaultCaption,
    })
    .select()
    .single();

  if (dbError) {
    throw new Error(`Failed to save media metadata: ${dbError.message}`);
  }

  return mediaRecord as SessionMedia;
}

/**
 * Upload multiple files to a session concurrently.
 */
export async function uploadMultipleSessionMedia(
  sessionId: string,
  files: File[],
  onFileUploaded?: (completed: number, total: number) => void,
): Promise<SessionMedia[]> {
  const uploaded: SessionMedia[] = [];
  let count = 0;

  for (const file of files) {
    const res = await uploadSessionMediaFile({
      sessionId,
      file,
    });
    count++;
    uploaded.push(res);
    onFileUploaded?.(count, files.length);
  }

  return uploaded;
}

/**
 * Delete a media item from Supabase storage and public.session_media table.
 */
export async function deleteSessionMedia(
  mediaId: string,
  publicId?: string | null,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (publicId && !publicId.startsWith("http")) {
    try {
      await supabase.storage.from("session-media").remove([publicId]);
    } catch (err) {
      console.warn("Storage deletion warning:", err);
    }
  }

  const { error } = await supabase.from("session_media").delete().eq("id", mediaId);
  if (error) {
    throw error;
  }
}
