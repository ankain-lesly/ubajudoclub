import { useState } from "react";
import { Image as ImageIcon, Video, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SessionMedia } from "@/lib/types";

interface SessionMediaPanelProps {
  sessionId: string;
  media: SessionMedia[];
  onAddMedia: (data: {
    sessionId: string;
    url: string;
    mediaType: "IMAGE" | "VIDEO";
    caption?: string;
    publicId?: string;
  }) => Promise<void>;
  onDeleteMedia: (mediaId: string) => Promise<void>;
}

export function SessionMediaPanel({
  sessionId,
  media,
  onAddMedia,
  onDeleteMedia,
}: SessionMediaPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [publicId, setPublicId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSaving(true);
    try {
      await onAddMedia({
        sessionId,
        url: url.trim(),
        mediaType,
        caption: caption.trim() || undefined,
        publicId: publicId.trim() || undefined,
      });
      setUrl("");
      setCaption("");
      setPublicId("");
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteMedia(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">
            Session Media ({media.length})
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Technique drills, randori clips, and tatami pictures.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs h-7"
        >
          <Plus className="w-3 h-3 mr-1" />
          {showAddForm ? "Cancel" : "Add Media"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-3 bg-secondary/30 rounded-lg border border-ink/10 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] font-mono uppercase text-muted-foreground">Media Type</Label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as "IMAGE" | "VIDEO")}
                className="mt-1 w-full h-8 rounded border border-input bg-background px-2 text-xs"
              >
                <option value="IMAGE">Photo / Picture</option>
                <option value="VIDEO">Video Replay / Drill</option>
              </select>
            </div>
            <div>
              <Label className="text-[10px] font-mono uppercase text-muted-foreground">Cloudinary / Public ID (opt)</Label>
              <Input
                value={publicId}
                onChange={(e) => setPublicId(e.target.value)}
                placeholder="folder/clip-12"
                className="mt-1 h-8 text-xs bg-background"
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-mono uppercase text-muted-foreground">Media URL *</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or https://..."
              className="mt-1 h-8 text-xs bg-background"
              required
            />
          </div>

          <div>
            <Label className="text-[10px] font-mono uppercase text-muted-foreground">Caption / Technique</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Roland demonstrating Uchi-mata off the left lapel"
              className="mt-1 h-8 text-xs bg-background"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" disabled={saving} className="text-xs h-7 bg-primary">
              {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Save Media
            </Button>
          </div>
        </form>
      )}

      {media.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-ink/15 text-muted-foreground text-xs">
          No photos or videos attached to this session yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg border border-ink/10 overflow-hidden bg-background flex flex-col"
            >
              <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
                {item.media_type === "IMAGE" ? (
                  <img
                    src={item.url}
                    alt={item.caption || "Session photo"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Video className="w-6 h-6 text-primary mb-1" />
                    <span className="text-[10px] font-mono text-muted-foreground">Video Clip</span>
                  </div>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                  title="Open source"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-foreground line-clamp-2">
                  {item.caption || "Training record"}
                </p>
                <div className="flex items-center justify-between pt-1.5 text-[9px] font-mono text-muted-foreground">
                  <span>{item.media_type}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-destructive hover:underline flex items-center"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-2.5 h-2.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
