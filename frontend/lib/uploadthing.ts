import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`
  : "http://localhost:3000/api/uploadthing";

export const UploadButton = generateUploadButton({
  url,
});

export const UploadDropzone = generateUploadDropzone({
  url,
});
