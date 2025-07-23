import { db } from "@/lib/db";
import React from "react";
import UploadCourseForm from "./components/upload-form";
import { auth } from "@/auth";

const UploadCourse = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const session = await auth();

  const [teachers] = await Promise.all([
    await db.teacher.findFirst({
      where: { name: session?.user.name as string },
      include: { subjects: true, teacherClass: { include: { class: true } } },
    }),
  ]);

  const allClasses = await db.class.findMany({
    include: {
      grade: true,
    },
  });

  const classes = allClasses.filter((cl) =>
    teachers?.teacherClass.some((t) => t.classId === cl.id)
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UploadCourseForm
          subjectId={teachers?.subjects?.id as string}
          gradeId={classes[0]?.grade?.id}
          teacherId={teachers?.id as string}
        />
      </div>
    </div>
  );
};

export default UploadCourse;
