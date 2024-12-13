import React, { useState, useEffect } from "react";
import Image from "next/image";
import Thumbnail from "@/public/svg/Thumbnail.svg"; 

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
            setThumbnailImage(file);
            onImageChange(file);
        }
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

                    <div className="flex flex-col gap-3 z-10 relative">
                        <div className="flex w-full items-center justify-center">
                            <div className="flex items-center justify-center rounded-full w-12 h-12 bg-[#F1F5F9]">
                                <Image src={Thumbnail} alt="upload icon" />
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-60 h-8 border-1 border-[#E2E8F0] text-sm bg-white flex items-center justify-center rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.04)]">
                                Upload Thumbnail
                            </div>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept=".jpg, .png"
                    />
                </label>
            </div>
        </div>
    );
};

export default ThumbnailUpload;
