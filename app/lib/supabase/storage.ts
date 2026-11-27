import { getSupabaseBrowserClient } from "./client";
import type { SessionMedia } from "@/lib/types";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
} from "@/lib/media/cloudinary";

export interface UploadSessionMediaOptions {
  sessionId: string;
  file: File;
  caption?: string;
}

/**
 * Upload a single pre-compressed photo or video.
 * Pure uploader: client upload components compress images via `compress.ts` before calling.
 * Uses Cloudinary as the primary provider, falling back to Supabase storage if not configured.
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

  // 1. Primary Provider: Cloudinary (pure uploader, clean URLs)
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

  // 2. Fallback Provider: Supabase Storage Bucket
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const uploadExt = file.name.split(".").pop()?.toLowerCase() || fileExt;
  const path = `${sessionId}/${Date.now()}_${cleanBaseName}.${uploadExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("session-media")
    .upload(path, file, {
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

/**
 * Sets a specific media item as the cover for its session,
 * automatically unsetting is_cover on all other media in that session.
 */
export async function setSessionMediaCover(
  mediaId: string,
  sessionId: string,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  // 1. Unset any existing cover for this session
  const { error: unsetError } = await supabase
    .from("session_media")
    .update({ is_cover: false })
    .eq("session_id", sessionId);

  if (unsetError) {
    throw new Error(`Failed to reset covers: ${unsetError.message}`);
  }

  // 2. Mark this media item as the cover
  const { error: setError } = await supabase
    .from("session_media")
    .update({ is_cover: true })
    .eq("id", mediaId);

  if (setError) {
    throw new Error(`Failed to set cover: ${setError.message}`);
  }
}
