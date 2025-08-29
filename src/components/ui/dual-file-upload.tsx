"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "~/lib/client/uploadthing";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import Icons from "../shared/icons";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

interface DualFileUploadProps {
  label: string;
  placeholder: string;
  description: string;
  acceptedFileTypes?: string[];
  maxFileSize?: string;
  maxFileCount?: number;
  value: string;
  onChange: (value: string) => void;
  uploadRoute: "imageUploader" | "videoUploader" | "audioUploader";
  className?: string;
}

export default function DualFileUpload({
  label,
  placeholder,
  description,
  acceptedFileTypes = ["*"],
  maxFileSize = "100MB",
  maxFileCount = 1,
  value,
  onChange,
  uploadRoute,
  className,
}: DualFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");

  const { startUpload, isUploading: isUploadThingUploading, routeConfig } = useUploadThing(
    uploadRoute,
    {
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          onChange(res[0].url);
          toast({
            title: "File uploaded successfully!",
            description: "Your file has been uploaded and is ready to use.",
          });
          setIsUploading(false);
          // Clear preview and files after successful upload
          if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
          }
          setFiles([]);
        }
      },
      onUploadError: (error) => {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your file. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
      },
    }
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFiles([file]);
    
    // Create preview for supported file types
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('video/')) {
      setPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('audio/')) {
      setPreview(URL.createObjectURL(file));
    }
  }, []);

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
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFiles([]);
  }, [preview]);

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  const handleModeChange = (mode: "url" | "upload") => {
    setUploadMode(mode);
    if (mode === "url") {
      // Clear uploaded files when switching to URL mode
      handleCancel();
    } else {
      // Clear URL when switching to upload mode
      onChange("");
    }
  };

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      
      <Tabs value={uploadMode} onValueChange={(value) => handleModeChange(value as "url" | "upload")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Paste URL</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-2">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
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
                    <p className="text-primary">Drop the file here...</p>
                  ) : (
                    <>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">
                        {acceptedFileTypes.join(", ")} up to {maxFileSize}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
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
                    onClick={handleCancel}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icons.close className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {preview && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  {files[0]?.type.startsWith('image/') ? (
                    <img src={preview} alt="Preview" className="max-h-32 rounded object-cover" />
                  ) : files[0]?.type.startsWith('video/') ? (
                    <video src={preview} controls className="max-h-32 rounded" />
                  ) : files[0]?.type.startsWith('audio/') ? (
                    <audio src={preview} controls className="w-full" />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icons.file className="h-4 w-4" />
                      <span>File preview not available</span>
                    </div>
                  )}
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
                      Upload File
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
      
      {value && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Icons.check className="mr-1 h-3 w-3" />
            File Ready
          </Badge>
          <span className="text-xs text-muted-foreground">
            {uploadMode === "url" ? "URL provided" : "File uploaded"}
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
