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

interface StudentHeaderProps {
  userName: string | undefined | null;
  userRole: string | undefined;
  grade: string | undefined;
  subjects: number | undefined;
}

export const StudentHeader = ({
  userName,
  userRole,
  grade,
  subjects,
}: StudentHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center p-4 gap-4">
      <div className="flex flex-row items-center gap-8 flex-1">
        <div className="flex-col">
          <h1>{userName}</h1>
          <p className="text-[12px] text-muted-foreground">
            {`You Have ${subjects} Subjects`}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary" className="rounded-full">
            {userRole}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {grade}
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => router.push("/student/view-certificates")}
      >
        View Certificates
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/student/view-courses")}
      >
        View Courses
      </Button>
    </div>
  );
};

export default StudentHeader;
