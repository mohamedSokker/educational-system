"use client";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import {
  Exam,
  GradeList,
  Student,
  Subject,
  Teacher,
  Textbook,
} from "@prisma/client";
import { File } from "lucide-react";

interface TeachersProps {
  student:
    | ({
        grade:
          | ({
              courses: ({
                teacher: Teacher;
                subject: Subject;
              } & Textbook)[];
            } & GradeList)
          | null;
      } & Student)
    | null;
}

const UploadCourseContent = ({ student }: TeachersProps) => {
  return (
    <CardContent className="w-full flex flex-col gap-4">
      {student?.grade?.courses.length === 0 ? (
        <div className="w-full p-4 flex justify-center text-muted-foreground text-[14px]">
          No thing to show
        </div>
      ) : (
        student?.grade?.courses.map((course) => (
          <div className="w-full text-muted-foreground text-[14px] flex flex-row gap-16 items-center">
            <div
              key={course.id}
              className="text-muted-foreground text-[14px] flex flex-row gap-2 items-center"
            >
              <File className="w-4 h-4" />
              <p
                className="hover:underline hover:cursor-pointer"
                onClick={() => window.open(course.fileUrl, "_blank")}
              >
                {course.title}
              </p>
            </div>
            <div className="text-muted-foreground text-[14px] flex flex-row gap-2 items-center">
              <Badge variant="secondary">{course.teacher.name}</Badge>
              <Badge variant="outline">{course.subject.name}</Badge>
              <Badge variant="default">{student.grade?.name}</Badge>
            </div>
          </div>
        ))
      )}
    </CardContent>
  );
};

export default UploadCourseContent;
