import { motion } from "framer-motion";
import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import LoadingIcon from "@/components/LoadingIcon/LoadingIcon";
import UploadIcon from "@/public/icons/UploadIcon";

interface UploadAreaInputProps {
  className?: string;
  onDrop: (acceptedFiles: File[]) => void;
  label?: string;
  subLabel?: string;
  helperText?: string;
  loading?: boolean;
  progress?: number;
  accept?: any;
}

const UploadAreaInput: React.FC<UploadAreaInputProps> = ({
  className,
  onDrop,
  label = "Drag your file here",
  subLabel,
  helperText,
  loading,
  progress,
  accept = [".csv, .xls, application/vnd.ms-excel"],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const inputProps = {
    ...getInputProps(),
    accept: accept,
  };

  const baseStyle =
    "bg-white border border-dotted cursor-pointer border-slate-300 rounded-md w-full h-full flex flex-col items-center justify-center text-center";
  const activeStyle = "bg-teal-500";
  const inputClasses = `${baseStyle} ${
    isDragActive ? activeStyle : ""
  } ${className}`;

  const handleFileSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading && progress) {
    return (
      <div className="border border-dashed border-grey-500 max-w-[400px] min-h-[80px] rounded-xl cursor-pointer hover:border-grey-800 flex flex-col justify-center p-4">
        <div className="flex items-center mb-2 text-primary-900 text-caption">
          <LoadingIcon />
          <p>Uploading document please wait... </p>
        </div>
        <div className="flex items-center">
          <p className="mr-2 font-bold text-caption text-green-600">
            {progress.toFixed()}%
          </p>
          <div className="w-full h-2 rounded-lg bg-primary-200 ">
            <motion.div
              className="h-2 rounded-lg bg-green-600"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div {...getRootProps()} className={inputClasses}>
        <input {...inputProps} ref={fileInputRef} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here...</p>
        ) : (
          <div className="flex items-center justify-center flex-col">
            <UploadIcon />
            <h5 className="text-slate-700 mt-2 text-md font-bold">{label}</h5>
            <p className="text-xs text-slate-500">
              {subLabel || "Supported format: CSV, XLS(1MB max file size)"}
            </p>
            <button
              onClick={handleFileSelect}
              className="text-md text-black-600 mt-2 shadow-2xl rounded-xl px-4 py-2 hover:bg-gray-100"
            >
              Select files
            </button>
          </div>
        )}
      </div>
      {helperText && (
        <p className="text-center w-full mt-3 text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </>
  );
};

export default UploadAreaInput;
