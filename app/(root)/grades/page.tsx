import { db } from "@/lib/db";

import { GradesClient } from "./components/client";

const Grades = async () => {
  const grades = await db.gradeList.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <GradesClient data={grades} />
      </div>
    </div>
  );
};

export default Grades;
