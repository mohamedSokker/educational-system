import { SubjectForm } from "./components/subject-form";
import { db } from "@/lib/db";

const SubjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const subjects = await db.subject.findUnique({
    where: {
      id: id,
    },
  });
  const grades = await db.gradeList.findMany();
  const teachers = await db.teacher.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubjectForm
          initialData={subjects}
          grades={grades}
          teachers={teachers}
        />
      </div>
    </div>
  );
};

export default SubjectPage;
