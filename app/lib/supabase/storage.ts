import { getSupabaseBrowserClient } from "./client";
import type { SessionMedia } from "@/lib/types";

export interface UploadSessionMediaOptions {
  sessionId: string;
  file: File;
  caption?: string;
}

/**
 * Upload a single photo or video to the 'session-media' Supabase storage bucket
 * and insert the corresponding row into public.session_media.
 */
export async function uploadSessionMediaFile({
  sessionId,
  file,
  caption,
}: UploadSessionMediaOptions): Promise<SessionMedia> {
  const supabase = getSupabaseBrowserClient();

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const path = `${sessionId}/${Date.now()}_${cleanBaseName}.${fileExt}`;

  const isVideo =
    file.type.startsWith("video/") ||
    ["mp4", "mov", "webm", "m4v", "avi", "mkv"].includes(fileExt);
  const mediaType: "IMAGE" | "VIDEO" = isVideo ? "VIDEO" : "IMAGE";

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
      media_type: mediaType,
      caption: caption || file.name.replace(/\.[^/.]+$/, ""),
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
