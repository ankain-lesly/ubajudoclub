import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Video,
  UploadCloud,
  Trash2,
  Loader2,
  ExternalLink,
  Plus,
  Film,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SessionMedia } from "@/lib/types";
import {
  uploadMultipleSessionMedia,
  deleteSessionMedia,
  setSessionMediaCover,
} from "@/lib/supabase/storage";
import { isVideoUrl } from "@/lib/media/cloudinary";

interface SessionMediaPanelProps {
  sessionId: string;
  media: SessionMedia[];
  onMediaChanged?: () => Promise<void> | void;
  /**
   * Optional compact mode for smaller containers like Sheet
   */
  compact?: boolean;
}

export function SessionMediaPanel({
  sessionId,
  media,
  onMediaChanged,
  compact = false,
}: SessionMediaPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSetCover = async (item: SessionMedia) => {
    if (!sessionId) return;
    setSettingCoverId(item.id);
    setErrorMessage(null);
    try {
      await setSessionMediaCover(item.id, sessionId);
      if (onMediaChanged) {
        await onMediaChanged();
      }
    } catch (err: any) {
      console.error("Set cover error:", err);
      setErrorMessage(err?.message || "Failed to set cover image.");
    } finally {
      setSettingCoverId(null);
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!sessionId) {
      setErrorMessage("Please save the session first before attaching media.");
      return;
    }

    const fileArray = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );

    if (fileArray.length === 0) {
      setErrorMessage("Please select valid image or video files.");
      return;
    }

    setUploading(true);
    setErrorMessage(null);
    setUploadProgress({ current: 0, total: fileArray.length });

    try {
      await uploadMultipleSessionMedia(sessionId, fileArray, (done, total) => {
        setUploadProgress({ current: done, total });
      });

      if (onMediaChanged) {
        await onMediaChanged();
      }
    } catch (err: any) {
      console.error("Media upload error:", err);
      setErrorMessage(err?.message || "Failed to upload one or more files.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDelete = async (item: SessionMedia) => {
    if (!confirm(`Delete this ${item.media_type.toLowerCase()}?`)) return;
    setDeletingId(item.id);
    setErrorMessage(null);
    try {
      await deleteSessionMedia(item.id, item.public_id);
      if (onMediaChanged) {
        await onMediaChanged();
      }
    } catch (err: any) {
      console.error("Delete media error:", err);
      setErrorMessage(err?.message || "Failed to delete media.");
    } finally {
      setDeletingId(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header and File Selection Button */}
      <div className="flex items-center justify-between">
        <div>
          <h4
            className={
              compact
                ? "font-display text-xs font-semibold text-foreground"
                : "font-display text-sm font-semibold text-foreground"
            }
          >
            Session Media ({media.length})
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Technique drills, randori clips, and tatami pictures.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading || !sessionId}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-1.5 bg-primary px-3 text-xs text-white shadow-sm hover:bg-primary/90"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>
                  {uploadProgress
                    ? `Uploading ${uploadProgress.current}/${uploadProgress.total}`
                    : "Uploading..."}
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Select Files</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && sessionId && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-ink/15 bg-secondary/20 hover:border-ink/30 hover:bg-secondary/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-xs transition-transform group-hover:scale-105">
          <UploadCloud className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-2 text-xs font-medium text-foreground">
          Click to browse or drop photos & videos here
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          PNG, JPG, WebP, MP4, MOV up to 100MB per file (Cloudinary CDN & Vault)
        </p>
      </div>

      {/* Media Grid */}
      {media.length > 0 && (
        <div
          className={`grid gap-2.5 ${
            compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {media.map((item) => {
            const isVideo = item.media_type === "VIDEO" || isVideoUrl(item.url);
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-background shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                  {isVideo ? (
                    <div className="relative h-full w-full bg-black">
                      <video
                        src={item.url}
                        poster={
                          item.thumbnail_url && !isVideoUrl(item.thumbnail_url)
                            ? item.thumbnail_url
                            : undefined
                        }
                        controls
                        preload="metadata"
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <img
                      src={item.thumbnail_url || item.url}
                      alt={item.caption || "Session photo"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Top-left Cover Badge */}
                  {item.is_cover && (
                    <div className="absolute left-1.5 top-1.5 z-10 flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-black shadow-xs">
                      <Star className="h-2.5 w-2.5 fill-black" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Top-right Action Buttons */}
                  <div className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      disabled={settingCoverId === item.id || item.is_cover}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(item);
                      }}
                      className={`flex h-6 w-6 items-center justify-center rounded-md backdrop-blur-xs transition-colors ${
                        item.is_cover
                          ? "bg-amber-400 text-black cursor-default"
                          : "bg-black/70 text-white hover:bg-amber-400 hover:text-black"
                      }`}
                      title={item.is_cover ? "Current cover image" : "Set as cover image"}
                    >
                      {settingCoverId === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Star className={`h-3 w-3 ${item.is_cover ? "fill-black" : ""}`} />
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur-xs hover:bg-black"
                      title="Open full size"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-destructive/90 text-white backdrop-blur-xs hover:bg-destructive"
                      title="Delete media"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-xs">
                    {isVideo ? "Video" : "Photo"}
                  </div>
                </div>

                {item.caption && (
                  <div className="p-2">
                    <p className="line-clamp-1 text-[11px] text-foreground" title={item.caption}>
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
