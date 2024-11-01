import { useEffect, useRef } from "react";
import { Button } from "@chakra-ui/react";

type Cloudinary = {
  createUploadWidget: (
    options: object,
    callback: (error: any, result: any) => void
  ) => { open: () => void } | undefined;
};

interface UploadWidgetProps {
  setImageUrl: (url: string) => void;
  isUploaded: boolean; // New prop
  setIsUploaded: (value: boolean) => void; // New prop to manage uploaded state
}

export default function UploadWidget({
  setImageUrl,
  isUploaded,
  setIsUploaded,
}: UploadWidgetProps) {
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
          setIsUploaded(true); // Set uploaded state
        }
      }
    );
  }, [setImageUrl, setIsUploaded]);

  return !isUploaded ? (
    <Button
      onClick={() => widgetRef.current?.open()}
      className="post-game-button"
    >
      Upload Image
    </Button>
  ) : null;
}
