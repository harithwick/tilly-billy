"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { supabase } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface ImageUploadProps {
  imageType: string;
  value?: string;
  onChange: (value: string | null) => void;
  className?: string;
}

export function ImageUpload({
  imageType,
  value,
  onChange,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("acceptedFiles", acceptedFiles);
      const file = acceptedFiles[0];
      if (file) {
        try {
          setIsUploading(true);

          // Show preview immediately
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            setPreview(base64String);
          };
          reader.readAsDataURL(file);

          const fileExt = file.name.split(".").pop();
          const fileName = `${imageType + "-" + uuidv4()}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from("images")
            .upload(fileName, file);

          if (error) throw error;

          // Get public URL
          onChange(fileName);
        } catch (error) {
          console.error("Error uploading image:", error);
          // Handle error (you might want to show a toast notification)
          setPreview(null);
          onChange(null);
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer",
          isDragActive && "border-primary bg-accent",
          preview && "border-none p-0"
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center justify-self-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : preview ? (
          <div className="relative text-center group max-h-64">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 p-4 text-center justify-center rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-sm text-muted-foreground">
            <ImagePlus className="h-8 w-8 mb-2" />
            <p className="font-medium">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here"}
            </p>
            <p>or click to select</p>
            <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
