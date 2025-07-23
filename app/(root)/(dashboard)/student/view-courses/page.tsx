import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import UploadCourseContent from "./components/upload-course-content";

const ManageCourses = async () => {
  const session = await auth();

  const [student] = await Promise.all([
    await db.student.findFirst({
      where: { name: session?.user.name as string },
      include: {
        grade: {
          include: { courses: { include: { teacher: true, subject: true } } },
        },
      },
    }),
  ]);
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Manage your courses</CardDescription>
        </CardHeader>
        <UploadCourseContent student={student} />
      </Card>
    </div>
  );
};

export default ManageCourses;
