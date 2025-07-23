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
import { Upload } from "lucide-react";
import UploadCourseBtn from "./components/upload-course-btn";
import UploadCourseContent from "./components/upload-course-content";

const ManageCourses = async () => {
  const session = await auth();

  const [teachers] = await Promise.all([
    await db.teacher.findMany({
      where: { name: session?.user.name as string },
      include: {
        courses: true,
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
        <UploadCourseContent teachers={teachers} />
        <CardFooter className="w-full flex justify-end">
          <UploadCourseBtn />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageCourses;
