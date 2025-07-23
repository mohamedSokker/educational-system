"use client";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Assignment,
  Class,
  GradeList,
  Student,
  Subject,
  Teacher,
} from "@prisma/client";
import { Plus } from "lucide-react";
import { TeacherHeaderDashboardData } from "@/types/teacher-dashboard";

export const TeacherHeader = ({
  userName,
  userRole,
  teachers,
  grade,
}: TeacherHeaderDashboardData) => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center p-4 gap-4">
      <div className="flex flex-row items-center gap-8 flex-1">
        <div className="flex-col">
          <h1>{userName}</h1>
          <p className="text-[12px] text-muted-foreground">
            {`You Have ${teachers?.teacherClass.length} Classes`}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary" className="rounded-full">
            {userRole}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {teachers?.subjects?.name}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {grade}
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => router.push("/teacher/create-assignment")}
      >
        <Plus />
        Create Assignment
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/teacher/create-exam")}
      >
        <Plus />
        Create Exam
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/teacher/view-reports")}
      >
        View Reports
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/teacher/manage-courses")}
      >
        Manage Courses
      </Button>
    </div>
  );
};

export default TeacherHeader;
