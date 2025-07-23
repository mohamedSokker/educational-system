import { db } from "@/lib/db";

import { StudentClient } from "./components/client";
import { StudentColumn } from "./components/columns";

const Teachers = async () => {
  const students = await db.student.findMany();

  const classes = await db.class.findMany();
  const grades = await db.gradeList.findMany();

  const formattedClass: StudentColumn[] = students.map((item) => ({
    id: item.id,
    name: item.name,
    gradeLabel: grades?.find((t) => t.id == item.gradeId)?.name,
    classId: item.classId,
    className: classes?.find((t) => t.id == item.classId)?.name,
    gradeId: item.gradeId,
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StudentClient data={formattedClass} />
      </div>
    </div>
  );
};

export default Teachers;
