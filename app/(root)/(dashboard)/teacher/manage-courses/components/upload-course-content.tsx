"use client";

import { CardContent } from "@/components/ui/card";
import { Teacher, Textbook } from "@prisma/client";
import { File } from "lucide-react";

interface TeachersProps {
  teachers: ({
    courses: Textbook[];
  } & Teacher)[];
}

const UploadCourseContent = ({ teachers }: TeachersProps) => {
  return (
    <CardContent className="w-full flex flex-col gap-4">
      {teachers?.[0].courses.length === 0 ? (
        <div className="w-full p-4 flex justify-center text-muted-foreground text-[14px]">
          No thing to show
        </div>
      ) : (
        teachers?.[0].courses.map((course) => (
          <div
            key={course.id}
            className="w-full text-muted-foreground text-[14px] flex flex-row gap-2 items-center"
          >
            <File className="w-4 h-4" />
            <p
              className="hover:underline hover:cursor-pointer"
              onClick={() => window.open(course.fileUrl, "_blank")}
            >
              {course.title}
            </p>
          </div>
        ))
      )}
    </CardContent>
  );
};

export default UploadCourseContent;
