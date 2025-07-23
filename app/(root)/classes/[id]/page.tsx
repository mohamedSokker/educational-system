import { ClassForm } from "./components/class-form";
import { db } from "@/lib/db";

const ClassPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const classes = await db.class.findUnique({
    where: {
      id: id,
    },
  });
  const grades = await db.gradeList.findMany();
  // const teachers = await db.teacher.findMany();
  // const students = await db.student.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClassForm
          initialData={classes}
          grades={grades}
          // teachers={teachers}
          // students={students}
        />
      </div>
    </div>
  );
};

export default ClassPage;
