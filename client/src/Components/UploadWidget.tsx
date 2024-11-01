import { useEffect, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";

type Cloudinary = {
  createUploadWidget: (
    options: object,
    callback: (error: any, result: any) => void
  ) => { open: () => void } | undefined;
};

interface UploadWidgetProps {
  setImageUrl: (url: string) => void;
}

export default function UploadWidget({ setImageUrl }: UploadWidgetProps) {
  const [isUploaded, setIsUploaded] = useState(false); // New state to track upload status
  const cloudinaryRef = useRef<Cloudinary | null>(null);
  const widgetRef = useRef<{ open: () => void } | null | undefined>(null);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "djsf0lwca",
        uploadPreset: "qv5gd0ci",
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          const url = result.info.secure_url;
          setImageUrl(url);
          setIsUploaded(true); // Set uploaded state to true
        }
      }
    );
  }, [setImageUrl]);

  return !isUploaded ? (
    <Button
      onClick={() => widgetRef.current?.open()}
      className="post-game-button"
    >
      Upload Image
    </Button>
  ) : null;
}
