"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "~/lib/client/uploadthing";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import Icons from "../shared/icons";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

interface MultiFileUploadProps {
  label: string;
  placeholder: string;
  description: string;
  acceptedFileTypes?: string[];
  maxFileSize?: string;
  maxFileCount?: number;
  value: string[];
  onChange: (value: string[]) => void;
  uploadRoute: "imageUploader" | "videoUploader" | "audioUploader";
  className?: string;
}

export default function MultiFileUpload({
  label,
  placeholder,
  description,
  acceptedFileTypes = ["*"],
  maxFileSize = "100MB",
  maxFileCount = 5,
  value,
  onChange,
  uploadRoute,
  className,
}: MultiFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [newUrl, setNewUrl] = useState("");

  const {
    startUpload,
    isUploading: isUploadThingUploading,
    routeConfig,
  } = useUploadThing(uploadRoute, {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const newUrls = res.map((file) => file.url);
        onChange([...value, ...newUrls]);
        toast({
          title: "Files uploaded successfully!",
          description: `${res.length} file(s) have been uploaded and are ready to use.`,
        });
        setIsUploading(false);
        // Clear previews and files after successful upload
        previews.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
        setPreviews([]);
        setFiles([]);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newFiles = [...files, ...acceptedFiles].slice(0, maxFileCount);
      setFiles(newFiles);

      // Create previews for supported file types
      const newPreviews = newFiles.map((file) => {
        if (
          file.type.startsWith("image/") ||
          file.type.startsWith("video/") ||
          file.type.startsWith("audio/")
        ) {
          return URL.createObjectURL(file);
        }
        return null;
      });
      setPreviews(newPreviews);
    },
    [files, maxFileCount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    maxFiles: maxFileCount,
    maxSize: parseFileSize(maxFileSize),
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      await startUpload(files);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  };

  const handleCancel = useCallback(() => {
    previews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setPreviews([]);
    setFiles([]);
  }, [previews]);

  const handleUrlAdd = () => {
    if (newUrl.trim() && !value.includes(newUrl.trim())) {
      onChange([...value, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const handleUrlRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleFileRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Remove corresponding preview
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]!);
    }
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  const handleModeChange = (mode: "url" | "upload") => {
    setUploadMode(mode);
    if (mode === "url") {
      // Clear uploaded files when switching to URL mode
      handleCancel();
    } else {
      // Clear URLs when switching to upload mode
      onChange([]);
    }
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>

      <Tabs
        value={uploadMode}
        onValueChange={(value) => handleModeChange(value as "url" | "upload")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Paste URLs</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder={placeholder}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUrlAdd();
                }
              }}
            />
            <Button onClick={handleUrlAdd} disabled={!newUrl.trim()}>
              Add
            </Button>
          </div>

          {value.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Added URLs:</p>
              {value.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="flex-1 truncate text-sm">{url}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUrlRemove(index)}
                    className="ml-2 text-destructive hover:text-destructive"
                  >
                    <Icons.close className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm text-muted-foreground">{description}</p>
        </TabsContent>

        <TabsContent value="upload" className="space-y-3">
          {files.length === 0 ? (
            <div
              className={cn(
                "flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50",
                isDragActive && "border-primary/50 bg-primary/5"
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2 text-center">
                <Icons.upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm">
                  {isDragActive ? (
                    <p className="text-primary">Drop the files here...</p>
                  ) : (
                    <>
                      <p className="font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {acceptedFileTypes.join(", ")} up to {maxFileSize} (max{" "}
                        {maxFileCount} files)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <Icons.file className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileRemove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icons.close className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {files.length < maxFileCount && (
                <div
                  className={cn(
                    "flex h-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
                  )}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icons.plus className="h-4 w-4" />
                    <span>Add more files</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || isUploadThingUploading}
                  className="flex-1"
                >
                  {isUploading || isUploadThingUploading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Icons.upload className="mr-2 h-4 w-4" />
                      Upload {files.length} File{files.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUploading || isUploadThingUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {value.length > 0 && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Icons.check className="mr-1 h-3 w-3" />
            {value.length} File{value.length !== 1 ? "s" : ""} Ready
          </Badge>
          <span className="text-xs text-muted-foreground">
            {uploadMode === "url" ? "URLs provided" : "Files uploaded"}
          </span>
        </div>
      )}
    </div>
  );
}

// Helper function to parse file size strings like "100MB" to bytes
function parseFileSize(sizeString: string): number {
  const units: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
  if (!match) return 100 * 1024 * 1024; // Default to 100MB

  const [, size, unit] = match;
  const unitKey = unit.toUpperCase();
  return parseFloat(size) * (units[unitKey] || units.MB);
}
