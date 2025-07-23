import { StudentForm } from "./components/student-form";
import { db } from "@/lib/db";

const TeacherPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const students = await db.student.findUnique({
    where: {
      id: id,
    },
  });
  const classes = await db.class.findMany();
  const grades = await db.gradeList.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StudentForm initialData={students} classes={classes} grades={grades} />
      </div>
    </div>
  );
};

export default TeacherPage;
