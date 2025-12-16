"use client";

import type React from "react";

import { useState, useRef, type DragEvent } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onFileSelected: (file: File | null) => void;
  preview: string | null;
}

export function ImageUploader({ onFileSelected, preview }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelected(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full h-full p-2">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Logo preview"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <ImageIcon className="w-12 h-12 text-gray-400" />
          <p className="text-sm text-center text-gray-500">
            Haz clic para seleccionar o arrastra una imagen
          </p>
          <p className="text-xs text-center text-gray-400">
            PNG, JPG, GIF hasta 10MB
          </p>
        </div>
      )}
    </div>
  );
}
