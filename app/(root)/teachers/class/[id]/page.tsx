import { TeacherForm } from "./components/teacher-form";
import { db } from "@/lib/db";

const TeacherPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const teacherClass = await db.teacherClass.findUnique({ where: { id: id } });

  const teachers = await db.teacher.findMany();
  const classes = await db.class.findMany();
  const subjects = await db.subject.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeacherForm
          initialData={teacherClass}
          teachers={teachers}
          classes={classes}
          subjects={subjects}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
