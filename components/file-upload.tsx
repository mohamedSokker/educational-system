"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { File, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const FileUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  // console.log(value);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {/* <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            /> */}
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="ecommerce"
        options={{
          resourceType: "raw", // important for non-image files like PDFs
          clientAllowedFormats: ["pdf"],
          multiple: false,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <File className="w-4 h-4 mr-2" />
              Upload file
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default FileUpload;
