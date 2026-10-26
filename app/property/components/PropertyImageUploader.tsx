"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import imageCompression from "browser-image-compression";
import { ImagePlus, LoaderCircle, Trash2, UploadCloud, X } from "lucide-react";

import {
  createPropertyImageUploadUrl,
  completePropertyImageUpload,
  deletePropertyImage,
  getPropertyImages,
} from "@/lib/images-actions";

type SavedImage = {
  id: string;
  property_id: string;
  storage_path: string;
  file_name: string | null;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
  url: string;
};

type QueueItem = {
  id: string;
  file: File;
  preview: string;
  status: "ready" | "compressing" | "uploading" | "saving" | "error";
  progress: number;
  error?: string;
};

type Props = {
  propertyId: string;
  onUploaded?: (image: SavedImage) => void;
  onDeleted?: (imageId: string) => void;
};

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_ORIGINAL_SIZE = 20 * 1024 * 1024;
const MAX_COMPRESSED_SIZE = 10 * 1024 * 1024;

function putFile(
  url: string,
  file: File,
  onProgress: (progress: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "image/webp");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`R2 upload failed (${xhr.status}).`));
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.send(file);
  });
}

export default function PropertyImageUploader({
  propertyId,
  onUploaded,
  onDeleted,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queueRef = useRef<QueueItem[]>([]);

  const [saved, setSaved] = useState<SavedImage[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) =>
        URL.revokeObjectURL(item.preview),
      );
    };
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<QueueItem>) => {
      setQueue((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      );
    },
    [],
  );

  const loadImages = useCallback(async () => {
    setLoading(true);

    const result = await getPropertyImages(propertyId);

    if (result.success) setSaved(result.data);
    else setMessage(result.error);

    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  function selectFiles(files: FileList | null) {
    if (!files) return;

    const next: QueueItem[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setMessage(`${file.name}: unsupported image type.`);
        continue;
      }

      if (file.size <= 0 || file.size > MAX_ORIGINAL_SIZE) {
        setMessage(`${file.name}: choose an image under 20 MB.`);
        continue;
      }

      next.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: "ready",
        progress: 0,
      });
    }

    setQueue((current) => [...current, ...next]);

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeQueuedItem(id: string) {
    const item = queueRef.current.find((entry) => entry.id === id);

    if (item) URL.revokeObjectURL(item.preview);

    setQueue((current) => current.filter((entry) => entry.id !== id));
  }

  async function uploadOne(item: QueueItem) {
    updateItem(item.id, {
      status: "compressing",
      progress: 0,
      error: undefined,
    });

    try {
      const blob = await imageCompression(item.file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.82,
      });

      if (blob.size > MAX_COMPRESSED_SIZE) {
        throw new Error("Compressed image exceeds 10 MB.");
      }

      const compressed = new File(
        [blob],
        `${item.file.name.replace(/\.[^.]+$/, "")}.webp`,
        { type: "image/webp" },
      );

      const signed = await createPropertyImageUploadUrl({
        propertyId,
        fileName: compressed.name,
        contentType: compressed.type,
        size: compressed.size,
      });

      if (!signed.success) throw new Error(signed.error);

      updateItem(item.id, { status: "uploading" });

      await putFile(
        signed.data.uploadUrl,
        compressed,
        (progress) => updateItem(item.id, { progress }),
      );

      updateItem(item.id, { status: "saving", progress: 100 });

      const result = await completePropertyImageUpload({
        propertyId,
        storagePath: signed.data.storagePath,
        fileName: compressed.name,
        altText: item.file.name.replace(/\.[^.]+$/, ""),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSaved((current) => {
        const withoutDuplicate = current.filter(
          (image) => image.id !== result.data.id,
        );

        return [...withoutDuplicate, result.data].sort(
          (a, b) => a.display_order - b.display_order,
        );
      });

      onUploaded?.(result.data);
      removeQueuedItem(item.id);
    } catch (error) {
      updateItem(item.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed.",
      });
    }
  }

  async function uploadAll() {
    if (uploading || queue.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      for (const item of [...queue]) {
        await uploadOne(item);
      }
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(image: SavedImage) {
    if (!window.confirm("Permanently delete this property image?")) return;

    setMessage("");

    const result = await deletePropertyImage({
      propertyId,
      imageId: image.id,
    });

    if (!result.success) {
      setMessage(result.error);
      return;
    }

    setSaved((current) =>
      current
        .filter((item) => item.id !== image.id)
        .map((item, index) => ({ ...item, display_order: index })),
    );

    onDeleted?.(image.id);
  }

  const busy = loading || uploading;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Property images</h2>
        <p className="text-sm text-muted-foreground">
          Select photos. They will be compressed to WebP before upload.
        </p>
      </div>

      {message && (
        <p role="alert" className="rounded-md border p-3 text-sm">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 hover:bg-muted/50 disabled:opacity-50"
      >
        <ImagePlus className="size-7" />
        <span className="font-medium">Choose property photos</span>
        <span className="text-xs text-muted-foreground">
          JPEG, PNG, WebP or AVIF · Up to 20 MB per original image
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(event) => selectFiles(event.target.files)}
      />

      {queue.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Selected images ({queue.length})</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {queue.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border">
                <div className="relative aspect-square bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="size-full object-cover"
                  />

                  <button
                    type="button"
                    aria-label="Remove selected image"
                    disabled={uploading}
                    onClick={() => removeQueuedItem(item.id)}
                    className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="space-y-2 p-2">
                  <p className="truncate text-xs">{item.file.name}</p>

                  {item.status === "ready" && (
                    <p className="text-xs text-muted-foreground">Ready</p>
                  )}

                  {item.status === "compressing" && (
                    <p className="text-xs text-muted-foreground">Compressing…</p>
                  )}

                  {item.status === "uploading" && (
                    <>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uploading {item.progress}%
                      </p>
                    </>
                  )}

                  {item.status === "saving" && (
                    <p className="text-xs text-muted-foreground">
                      Saving image record…
                    </p>
                  )}

                  {item.status === "error" && (
                    <p role="alert" className="text-xs text-destructive">
                      {item.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={uploadAll}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {uploading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            {uploading ? "Uploading…" : "Upload selected images"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-medium">Uploaded images ({saved.length})</h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading images…</p>
        ) : saved.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No images have been uploaded for this property.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border">
                <div className="relative aspect-square bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt_text ?? "Property photo"}
                    loading="lazy"
                    className="size-full object-cover"
                  />

                  {image.is_primary && (
                    <span className="absolute left-2 top-2 rounded bg-background/90 px-2 py-1 text-xs">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label="Delete property image"
                    onClick={() => deleteImage(image)}
                    className="absolute right-2 top-2 rounded-full bg-background/90 p-2 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <p className="truncate p-2 text-xs text-muted-foreground">
                  {image.file_name ?? "Property photo"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}