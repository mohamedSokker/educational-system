import { GradeForm } from "./components/grade-form";
import { db } from "@/lib/db";

const GradePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const grade = await db.gradeList.findUnique({
    where: {
      id: id,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GradeForm initialData={grade} />
      </div>
    </div>
  );
};

export default GradePage;
