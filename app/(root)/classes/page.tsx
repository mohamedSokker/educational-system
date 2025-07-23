import { db } from "@/lib/db";
// import { format } from "date-fns";

import { ClassClient } from "./components/client";
import { ClassColumn } from "./components/columns";

const Classes = async () => {
  const classes = await db.class.findMany({
    include: { grade: true },
  });

  const teachers = await db.teacher.findMany();
  const students = await db.student.findMany();

  const formattedClass: ClassColumn[] = classes.map((item) => ({
    id: item.id,
    name: item.name,
    gradeLabel: item.grade.name,
    createdAt: item.createdAt,
    teacherId: item.teacherId,
    teacherName: teachers?.find((t) => t.id == item.teacherId)?.name,
    studentId: item.studentId,
    studentName: students?.find((t) => t.id == item.studentId)?.name,
    gradeId: item.gradeId,
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClassClient data={formattedClass} />
      </div>
    </div>
  );
};

export default Classes;
