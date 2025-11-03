import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Thumbnail from "@/public/svg/Thumbnail.svg";
import CompanyThemedButton from "@/components/Buttons/CompanyThemedButton";

interface ThumbnailUploadProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  initialImage = "",
  onImageChange,
}) => {
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage);
  const [logoPresentOnLoad, setLogoPresentOnLoad] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (thumbnailImage) {
      const objectUrl = URL.createObjectURL(thumbnailImage);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(initialImage);
      setLogoPresentOnLoad(!!initialImage);
    }
  }, [thumbnailImage, initialImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setThumbnailImage(file); // Update the local state for preview
      onImageChange(file); // Update the parent state
    }
  };

  const handleRemoveImage = () => {
    setThumbnailImage(null);
    setPreviewImage(null);
    setLogoPresentOnLoad(false);
    onImageChange(null);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full my-2">
      <div className="flex justify-center items-center w-full relative my-2">
        <label
          className="flex justify-center items-center bg-slate-50 rounded-lg border-2 border-dashed w-full h-64 group-item text-center"
          style={{
            backgroundImage: previewImage ? `url(${previewImage})` : "",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay when image is present */}
          {(previewImage || logoPresentOnLoad) && (
            <div className="absolute inset-0 bg-black bg-opacity-50 h-64"></div>
          )}

          {/* Show upload icon only if no image is uploaded */}
          {!previewImage && !logoPresentOnLoad && (
            <div className="flex flex-col gap-3 z-10 relative">
              <div className="flex w-full items-center justify-center">
                <div className="flex items-center justify-center rounded-full w-12 h-12 bg-[#F1F5F9]">
                  <Image src={Thumbnail} alt="upload icon" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <CompanyThemedButton
                  className="bg-black text-white rounded-lg text-sm"
                  onPress={triggerFileInput}
                >
                  Upload Thumbnail
                </CompanyThemedButton>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept="*/*"
          />
        </label>

        {/* Show Remove button when an image is uploaded */}
        {previewImage && (
          <div className="absolute bottom-4">
            <CompanyThemedButton
              className="bg-black text-white hover:bg-gray-100 rounded-lg shadow"
              onPress={handleRemoveImage}
            >
              Remove Thumbnail
            </CompanyThemedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailUpload;
