import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileImage,
  Minimize2,
  CloudUpload,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Download,
  RotateCcw,
  RefreshCw,
  Loader2,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  compressImageBeforeUpload,
  type ResizeOptions,
} from "@/lib/media/compress";
import {
  uploadToCloudinary,
  isCloudinaryConfigured,
  isVideoUrl,
  type CloudinaryUploadResponse,
} from "@/lib/media/cloudinary";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/test.media";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Media Compression Inspector — UBa Judo Club" },
    {
      name: "description",
      content:
        "Inspect raw, compressed, and uploaded media side-by-side to verify orientation, aspect ratio, file size, and clean Cloudinary URLs.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

interface MediaProbe {
  file: File;
  previewUrl: string;
  isVideo: boolean;
  width: number;
  height: number;
  durationMs?: number;
}

interface UploadedProbe {
  response: CloudinaryUploadResponse;
  renderedWidth: number;
  renderedHeight: number;
  durationMs: number;
}

function formatBytes(bytes?: number | null): string {
  if (bytes === undefined || bytes === null || Number.isNaN(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getOrientation(w: number, h: number): "Portrait" | "Landscape" | "Square" | "Unknown" {
  if (!w || !h) return "Unknown";
  if (Math.abs(w - h) <= 2) return "Square";
  return h > w ? "Portrait" : "Landscape";
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function formatRatio(w: number, h: number): string {
  if (!w || !h) return "—";
  const decimal = (w / h).toFixed(3);
  const d = gcd(w, h);
  const rw = Math.round(w / d);
  const rh = Math.round(h / d);
  if (rw <= 25 && rh <= 25) {
    return `${rw}:${rh} (${decimal})`;
  }
  return decimal;
}

function calcAspectDriftPercent(w1: number, h1: number, w2: number, h2: number): number | null {
  if (!w1 || !h1 || !w2 || !h2) return null;
  const r1 = w1 / h1;
  const r2 = w2 / h2;
  return Math.abs((r2 - r1) / r1) * 100;
}

function hasCloudinaryTransformParams(url: string): boolean {
  if (!url.includes("res.cloudinary.com")) return false;
  const match = url.match(/\/(?:image|video)\/upload\/([^/]+)\//);
  if (!match) return false;
  const segment = match[1];
  // A version segment like `v1732700000` is clean; transform params contain `_` or `,`
  if (/^v\d+$/.test(segment)) return false;
  return /(?:^|,)(?:c_|w_|h_|q_|f_|g_|so_|ar_)/.test(segment);
}

function probeFileMedia(file: File): Promise<MediaProbe> {
  return new Promise((resolve) => {
    const previewUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/") || isVideoUrl(file.name);

    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          file,
          previewUrl,
          isVideo: true,
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
        });
      };
      video.onerror = () => {
        resolve({ file, previewUrl, isVideo: true, width: 0, height: 0 });
      };
      video.src = previewUrl;
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({
        file,
        previewUrl,
        isVideo: false,
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
      });
    };
    img.onerror = () => {
      resolve({ file, previewUrl, isVideo: false, width: 0, height: 0 });
    };
    img.src = previewUrl;
  });
}

function probeRemoteImage(url: string, isVideo: boolean): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (isVideo) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        resolve({ width: video.videoWidth || 0, height: video.videoHeight || 0 });
      video.onerror = () => resolve({ width: 0, height: 0 });
      video.src = url;
      return;
    }

    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export default function TestMediaInspect() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawProbe, setRawProbe] = useState<MediaProbe | null>(null);
  const [compressedProbe, setCompressedProbe] = useState<MediaProbe | null>(null);
  const [uploadedProbe, setUploadedProbe] = useState<UploadedProbe | null>(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");

  // Interactive compression settings
  const [maxWidth, setMaxWidth] = useState(1600);
  const [maxHeight, setMaxHeight] = useState(1600);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<"AUTO" | "JPEG" | "PNG" | "WEBP">("AUTO");

  const cloudinaryReady = isCloudinaryConfigured();

  // Revoke object URLs on unmount or replacement
  useEffect(() => {
    return () => {
      if (rawProbe?.previewUrl) URL.revokeObjectURL(rawProbe.previewUrl);
    };
  }, [rawProbe]);

  useEffect(() => {
    return () => {
      if (compressedProbe?.previewUrl) URL.revokeObjectURL(compressedProbe.previewUrl);
    };
  }, [compressedProbe]);

  const runCompression = useCallback(
    async (
      sourceFile: File,
      opts: { maxWidth: number; maxHeight: number; quality: number; format: "AUTO" | "JPEG" | "PNG" | "WEBP" }
    ) => {
      setIsCompressing(true);
      setUploadedProbe(null);

      try {
        const resizeOptions: ResizeOptions = {
          maxWidth: opts.maxWidth,
          maxHeight: opts.maxHeight,
          quality: opts.quality,
          ...(opts.format !== "AUTO" ? { format: opts.format } : {}),
        };

        const start = performance.now();
        const compressedFile = await compressImageBeforeUpload(sourceFile, resizeOptions);
        const durationMs = Math.round(performance.now() - start);

        const probe = await probeFileMedia(compressedFile);
        setCompressedProbe({ ...probe, durationMs });
      } catch (err: any) {
        toast.error(err?.message || "Compression failed");
      } finally {
        setIsCompressing(false);
      }
    },
    []
  );

  const handleFileSelect = async (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video file.");
      return;
    }

    setUploadedProbe(null);
    setCompressedProbe(null);

    const probedRaw = await probeFileMedia(file);
    setRawProbe(probedRaw);

    await runCompression(file, { maxWidth, maxHeight, quality, format });
  };

  const handleRecompress = async () => {
    if (!rawProbe) return;
    await runCompression(rawProbe.file, { maxWidth, maxHeight, quality, format });
    toast.success("Re-compressed with updated settings");
  };

  const handleUpload = async () => {
    if (!compressedProbe) return;
    if (!cloudinaryReady) {
      toast.error("Cloudinary env vars are not configured.");
      return;
    }

    setIsUploading(true);
    try {
      const start = performance.now();
      // Column 2 already compressed the file; uploadToCloudinary is a pure uploader
      const res = await uploadToCloudinary(compressedProbe.file, {
        folder: "ubajudo/test-inspect",
        caption: `Inspect: ${compressedProbe.file.name}`,
      });
      const durationMs = Math.round(performance.now() - start);

      const remoteDims = await probeRemoteImage(
        res.secure_url,
        res.resource_type === "video"
      );

      setUploadedProbe({
        response: res,
        renderedWidth: remoteDims.width,
        renderedHeight: remoteDims.height,
        durationMs,
      });
      toast.success("Uploaded cleanly to Cloudinary");
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setRawProbe(null);
    setCompressedProbe(null);
    setUploadedProbe(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadCompressed = () => {
    if (!compressedProbe) return;
    const a = document.createElement("a");
    a.href = compressedProbe.previewUrl;
    a.download = compressedProbe.file.name;
    a.click();
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      toast.success("Copied URL to clipboard");
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  // Computed comparison metrics
  const savedBytes =
    rawProbe && compressedProbe ? rawProbe.file.size - compressedProbe.file.size : null;
  const savedPercent =
    rawProbe && compressedProbe && rawProbe.file.size > 0
      ? ((1 - compressedProbe.file.size / rawProbe.file.size) * 100).toFixed(1)
      : null;

  const rawOrientation = rawProbe ? getOrientation(rawProbe.width, rawProbe.height) : "Unknown";
  const compOrientation = compressedProbe
    ? getOrientation(compressedProbe.width, compressedProbe.height)
    : "Unknown";
  const uploadOrientation = uploadedProbe
    ? getOrientation(
        uploadedProbe.renderedWidth || uploadedProbe.response.width || 0,
        uploadedProbe.renderedHeight || uploadedProbe.response.height || 0
      )
    : "Unknown";

  const compDrift =
    rawProbe && compressedProbe
      ? calcAspectDriftPercent(
          rawProbe.width,
          rawProbe.height,
          compressedProbe.width,
          compressedProbe.height
        )
      : null;

  const uploadDrift =
    rawProbe && uploadedProbe
      ? calcAspectDriftPercent(
          rawProbe.width,
          rawProbe.height,
          uploadedProbe.renderedWidth || uploadedProbe.response.width || 0,
          uploadedProbe.renderedHeight || uploadedProbe.response.height || 0
        )
      : null;

  const orientationMatch =
    rawProbe && compressedProbe
      ? rawOrientation === compOrientation && (compDrift === null || compDrift < 1.5)
      : null;

  const isCleanRemoteUrl = uploadedProbe
    ? !hasCloudinaryTransformParams(uploadedProbe.response.secure_url) &&
      !hasCloudinaryTransformParams(uploadedProbe.response.thumbnail_url)
    : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Banner */}
      <section className="border-b border-ink/10 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Diagnostic Sandbox · /test/media
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Media Compression & Upload Inspector
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Compare the <strong className="text-foreground">Raw File</strong>,{" "}
                <strong className="text-foreground">Compressed Output</strong> (
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                  compress.ts
                </code>
                ), and <strong className="text-foreground">Uploaded CDN Asset</strong>{" "}
                side-by-side to verify portrait/landscape orientation, aspect ratio integrity, and
                clean URLs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFitMode((m) => (m === "contain" ? "cover" : "contain"))}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-background px-3.5 py-2 font-mono text-[11px] font-medium transition-colors hover:bg-secondary/60"
                title="Toggle preview object-fit"
              >
                <Maximize2 className="h-3.5 w-3.5 text-primary" />
                Fit: {fitMode === "contain" ? "True Aspect (Contain)" : "Crop (Cover)"}
              </button>

              {rawProbe && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-background px-3.5 py-2 font-mono text-[11px] font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Dropzone + Compression Settings Controls */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            {/* File Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) handleFileSelect(dropped);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed p-5 transition-all",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-ink/15 bg-card/70 hover:border-primary/50 hover:bg-card"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {rawProbe ? `Selected: ${rawProbe.file.name}` : "Drop a portrait or landscape photo here"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Click to browse · JPG, PNG, WebP, AVIF, MP4, MOV
                  </p>
                </div>
              </div>
              <span className="hidden rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper sm:inline-block">
                Choose File
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </div>

            {/* Compression Controls */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-ink/12 bg-card/80 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                  compress.ts Parameters
                </span>
                {rawProbe && (
                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={handleRecompress}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                  >
                    <RefreshCw className={cn("h-3 w-3", isCompressing && "animate-spin")} />
                    Re-compress
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">Max W (px)</span>
                  <input
                    type="number"
                    min={200}
                    max={4096}
                    step={100}
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value) || 1600)}
                    className="rounded-lg border border-ink/15 bg-background px-2.5 py-1.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">Max H (px)</span>
                  <input
                    type="number"
                    min={200}
                    max={4096}
                    step={100}
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(Number(e.target.value) || 1600)}
                    className="rounded-lg border border-ink/15 bg-background px-2.5 py-1.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Quality ({quality})
                  </span>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="mt-1.5 accent-primary"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-muted-foreground">Format</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="rounded-lg border border-ink/15 bg-background px-2 py-1.5 font-mono text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="AUTO">Auto</option>
                    <option value="JPEG">JPEG</option>
                    <option value="PNG">PNG</option>
                    <option value="WEBP">WEBP</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Delta Strip */}
          {rawProbe && compressedProbe && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-card/90 px-4 py-3 text-xs">
              <div className="flex items-center gap-1.5">
                {orientationMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="font-medium">
                  Orientation: <strong>{rawOrientation}</strong> →{" "}
                  <strong>{compOrientation}</strong>
                  {compDrift !== null && (
                    <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                      (drift: {compDrift.toFixed(2)}%)
                    </span>
                  )}
                </span>
              </div>

              <span className="hidden h-4 w-px bg-ink/15 sm:inline-block" />

              <div className="font-mono text-[11px]">
                Savings:{" "}
                <strong
                  className={cn(
                    Number(savedPercent) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  )}
                >
                  {savedPercent !== null ? `${savedPercent}%` : "0%"}
                </strong>{" "}
                <span className="text-muted-foreground">
                  ({formatBytes(rawProbe.file.size)} → {formatBytes(compressedProbe.file.size)}
                  {savedBytes !== null && savedBytes > 0 ? `, -${formatBytes(savedBytes)}` : ""})
                </span>
              </div>

              {compressedProbe.durationMs !== undefined && (
                <>
                  <span className="hidden h-4 w-px bg-ink/15 sm:inline-block" />
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Time: <strong className="text-foreground">{compressedProbe.durationMs} ms</strong>
                  </span>
                </>
              )}

              {uploadedProbe && (
                <>
                  <span className="hidden h-4 w-px bg-ink/15 sm:inline-block" />
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    {isCleanRemoteUrl ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Clean CDN URL
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-amber-600 font-semibold">Transform Params Found</span>
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Three-Column Comparison Grid */}
      <section className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* COLUMN 1: RAW FILE */}
          <InspectCard
            step="01"
            title="Raw File"
            subtitle="Original browser input"
            icon={<FileImage className="h-4 w-4 text-primary" />}
            badge={rawProbe ? rawOrientation : undefined}
          >
            {rawProbe ? (
              <>
                <MediaStage
                  url={rawProbe.previewUrl}
                  isVideo={rawProbe.isVideo}
                  fitMode={fitMode}
                  alt="Raw original preview"
                />
                <MetaTable
                  rows={[
                    { label: "File Name", value: rawProbe.file.name, mono: true },
                    { label: "MIME Type", value: rawProbe.file.type || "unknown", mono: true },
                    {
                      label: "File Size",
                      value: `${formatBytes(rawProbe.file.size)} (${rawProbe.file.size.toLocaleString()} B)`,
                      mono: true,
                    },
                    {
                      label: "Dimensions",
                      value:
                        rawProbe.width && rawProbe.height
                          ? `${rawProbe.width} × ${rawProbe.height} px`
                          : "—",
                      mono: true,
                    },
                    {
                      label: "Aspect Ratio",
                      value: formatRatio(rawProbe.width, rawProbe.height),
                      mono: true,
                    },
                    {
                      label: "Orientation",
                      value: rawOrientation,
                      highlight: true,
                    },
                  ]}
                />
              </>
            ) : (
              <EmptyStage label="Select or drop a media file to inspect the raw input." />
            )}
          </InspectCard>

          {/* COLUMN 2: COMPRESSED FILE */}
          <InspectCard
            step="02"
            title="Compressed File"
            subtitle="compress.ts (react-image-file-resizer)"
            icon={<Minimize2 className="h-4 w-4 text-primary" />}
            badge={
              isCompressing
                ? "Compressing..."
                : compressedProbe
                  ? compOrientation
                  : undefined
            }
            headerAction={
              compressedProbe && (
                <button
                  type="button"
                  onClick={handleDownloadCompressed}
                  className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10px] hover:bg-secondary"
                  title="Download compressed file locally"
                >
                  <Download className="h-3 w-3" />
                  Save
                </button>
              )
            }
          >
            {isCompressing ? (
              <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-ink/10 bg-secondary/20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="font-mono text-xs text-muted-foreground">
                  Compressing with react-image-file-resizer...
                </p>
              </div>
            ) : compressedProbe ? (
              <>
                <MediaStage
                  url={compressedProbe.previewUrl}
                  isVideo={compressedProbe.isVideo}
                  fitMode={fitMode}
                  alt="Compressed output preview"
                />
                <MetaTable
                  rows={[
                    { label: "File Name", value: compressedProbe.file.name, mono: true },
                    { label: "MIME Type", value: compressedProbe.file.type || "unknown", mono: true },
                    {
                      label: "File Size",
                      value: `${formatBytes(compressedProbe.file.size)} ${
                        savedPercent !== null ? `(-${savedPercent}%)` : ""
                      }`,
                      mono: true,
                      highlight: Number(savedPercent) > 0,
                    },
                    {
                      label: "Dimensions",
                      value:
                        compressedProbe.width && compressedProbe.height
                          ? `${compressedProbe.width} × ${compressedProbe.height} px`
                          : "—",
                      mono: true,
                    },
                    {
                      label: "Aspect Ratio",
                      value: `${formatRatio(compressedProbe.width, compressedProbe.height)}${
                        compDrift !== null ? ` · Δ${compDrift.toFixed(2)}%` : ""
                      }`,
                      mono: true,
                    },
                    {
                      label: "Orientation",
                      value: `${compOrientation} ${orientationMatch ? "✓" : "⚠"}`,
                      highlight: Boolean(orientationMatch),
                    },
                    {
                      label: "Process Time",
                      value:
                        compressedProbe.durationMs !== undefined
                          ? `${compressedProbe.durationMs} ms`
                          : "—",
                      mono: true,
                    },
                  ]}
                />
              </>
            ) : (
              <EmptyStage label="Compressed output & delta metrics will appear here automatically." />
            )}
          </InspectCard>

          {/* COLUMN 3: UPLOADED FILE */}
          <InspectCard
            step="03"
            title="Uploaded File"
            subtitle="Cloudinary CDN live response"
            icon={<CloudUpload className="h-4 w-4 text-primary" />}
            badge={
              isUploading
                ? "Uploading..."
                : uploadedProbe
                  ? uploadOrientation
                  : undefined
            }
            headerAction={
              uploadedProbe && (
                <a
                  href={uploadedProbe.response.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10px] hover:bg-secondary"
                >
                  Open
                  <ExternalLink className="h-3 w-3" />
                </a>
              )
            }
          >
            {isUploading ? (
              <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-ink/10 bg-secondary/20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="font-mono text-xs text-muted-foreground">
                  Uploading compressed file to Cloudinary...
                </p>
              </div>
            ) : uploadedProbe ? (
              <>
                <MediaStage
                  url={uploadedProbe.response.secure_url}
                  isVideo={uploadedProbe.response.resource_type === "video"}
                  fitMode={fitMode}
                  alt="Uploaded Cloudinary preview"
                />
                <MetaTable
                  rows={[
                    {
                      label: "Public ID",
                      value: uploadedProbe.response.public_id,
                      mono: true,
                    },
                    {
                      label: "Format / Type",
                      value: `${uploadedProbe.response.format?.toUpperCase() || "—"} (${uploadedProbe.response.resource_type})`,
                      mono: true,
                    },
                    {
                      label: "Remote Size",
                      value: formatBytes(uploadedProbe.response.bytes),
                      mono: true,
                    },
                    {
                      label: "CDN Dimensions",
                      value: `${uploadedProbe.response.width || uploadedProbe.renderedWidth} × ${uploadedProbe.response.height || uploadedProbe.renderedHeight} px`,
                      mono: true,
                    },
                    {
                      label: "Aspect Ratio",
                      value: `${formatRatio(
                        uploadedProbe.renderedWidth || uploadedProbe.response.width || 0,
                        uploadedProbe.renderedHeight || uploadedProbe.response.height || 0
                      )}${uploadDrift !== null ? ` · Δ${uploadDrift.toFixed(2)}%` : ""}`,
                      mono: true,
                    },
                    {
                      label: "URL Cleanliness",
                      value: isCleanRemoteUrl
                        ? "Clean (0 transform params) ✓"
                        : "Has transform params ⚠",
                      highlight: Boolean(isCleanRemoteUrl),
                    },
                    {
                      label: "Upload Time",
                      value: `${uploadedProbe.durationMs} ms`,
                      mono: true,
                    },
                  ]}
                />

                {/* Copyable Clean URL Box */}
                <div className="mt-3 rounded-xl border border-ink/10 bg-secondary/30 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      secure_url
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(uploadedProbe.response.secure_url)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:underline"
                    >
                      {copiedUrl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedUrl ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-1 break-all font-mono text-[10px] text-foreground/80">
                    {uploadedProbe.response.secure_url}
                  </p>
                </div>
              </>
            ) : compressedProbe ? (
              <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-ink/15 bg-secondary/15 p-6 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <CloudUpload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ready to Upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload the compressed file ({formatBytes(compressedProbe.file.size)}) to
                    Cloudinary to verify remote CDN dimensions & clean URL.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!cloudinaryReady || isUploading}
                  onClick={handleUpload}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  <CloudUpload className="h-4 w-4" />
                  Upload to Cloudinary
                </button>
                {!cloudinaryReady && (
                  <p className="font-mono text-[10px] text-destructive">
                    Cloudinary env vars missing (VITE_CLOUDINARY_CLOUD_NAME / UPLOAD_PRESET)
                  </p>
                )}
              </div>
            ) : (
              <EmptyStage label="Upload the compressed media to inspect the live Cloudinary response." />
            )}
          </InspectCard>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Local Sub-Components                                                       */
/* -------------------------------------------------------------------------- */

function InspectCard({
  step,
  title,
  subtitle,
  icon,
  badge,
  headerAction,
  children,
}: {
  step: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/12 bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-ink/8 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-primary">{step}</span>
              <h2 className="font-display text-base font-semibold leading-none">{title}</h2>
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-medium text-foreground">
              {badge}
            </span>
          )}
          {headerAction}
        </div>
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function MediaStage({
  url,
  isVideo,
  fitMode,
  alt,
}: {
  url: string;
  isVideo: boolean;
  fitMode: "contain" | "cover";
  alt: string;
}) {
  return (
    <div className="relative mb-4 flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-[repeating-conic-gradient(rgba(128,128,128,0.08)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
      {isVideo ? (
        <video
          src={url}
          controls
          playsInline
          className={cn(
            "h-full w-full",
            fitMode === "contain" ? "object-contain" : "object-cover"
          )}
        />
      ) : (
        <img
          src={url}
          alt={alt}
          className={cn(
            "h-full w-full transition-all duration-300",
            fitMode === "contain" ? "object-contain" : "object-cover"
          )}
        />
      )}
    </div>
  );
}

function EmptyStage({ label }: { label: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-ink/12 bg-secondary/15 p-6 text-center">
      <p className="max-w-[220px] text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function MetaTable({
  rows,
}: {
  rows: { label: string; value: string; mono?: boolean; highlight?: boolean }[];
}) {
  return (
    <dl className="divide-y divide-ink/8 rounded-xl border border-ink/10 bg-background/60 px-3 text-xs">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 py-2">
          <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
          <dd
            className={cn(
              "truncate text-right font-medium",
              row.mono && "font-mono text-[11px]",
              row.highlight ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-foreground"
            )}
            title={row.value}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
