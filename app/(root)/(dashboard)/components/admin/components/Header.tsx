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

interface AdminHeaderProps {
  userName: string | undefined | null;
  userRole: string | undefined;
}

export const AdminHeader = ({ userName, userRole }: AdminHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center p-4 gap-4">
      <div className="flex flex-row items-center gap-8 flex-1">
        <div className="flex-col">
          <h1>{userName}</h1>
        </div>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary" className="rounded-full">
            {userRole}
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => router.push("/student/view-certificates")}
      >
        <Plus />
        Create Report
      </Button>
    </div>
  );
};

export default AdminHeader;
