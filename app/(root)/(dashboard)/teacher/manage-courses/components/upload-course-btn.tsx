"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const UploadCourseBtn = () => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.push("/teacher/upload-course")}
    >
      <Upload />
      Upload Course
    </Button>
  );
};

export default UploadCourseBtn;
