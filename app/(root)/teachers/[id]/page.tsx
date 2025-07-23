import { TeacherForm } from "./components/teacher-form";
import { db } from "@/lib/db";

const TeacherPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const teachers = await db.teacher.findUnique({
    where: {
      id: id,
    },
  });
  const classes = await db.class.findMany();
  const subjects = await db.subject.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeacherForm
          initialData={teachers}
          classes={classes}
          subjects={subjects}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
