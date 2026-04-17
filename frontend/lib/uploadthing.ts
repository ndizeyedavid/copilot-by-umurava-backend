import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../../backend/src/uploadthing";

const url = process.env.NEXT_PUBLIC_BACKEND_URL 
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing` 
  : "http://localhost:3000/api/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url,
});
