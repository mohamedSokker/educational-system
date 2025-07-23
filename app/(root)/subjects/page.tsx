import { db } from "@/lib/db";
// import { format } from "date-fns";

import { SubjectClient } from "./components/client";
import { SubjectColumn } from "./components/columns";

const Subjects = async () => {
  const subjects = await db.subject.findMany({
    include: { grade: true },
  });

  const formattedSubjects: SubjectColumn[] = subjects.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    gradeLabel: item.grade?.name,
    gradeId: item.gradeId,
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubjectClient data={formattedSubjects} />
      </div>
    </div>
  );
};

export default Subjects;
