import { db } from "@/lib/db";
import { auth } from "@/auth";

import { AssignmentsForm } from "./components/form";

const CreateAssignment = async () => {
  const session = await auth();
  const [teachers] = await Promise.all([
    await db.teacher.findFirst({
      where: { name: session?.user.name as string },
      include: { teacherClass: { include: { class: true } } },
    }),
  ]);

  const allClasses = await db.class.findMany();

  const classes = allClasses.filter((cl) =>
    teachers?.teacherClass.some((t) => t.classId === cl.id)
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AssignmentsForm classes={classes} teacherId={teachers?.id as string} />
      </div>
    </div>
  );
};

export default CreateAssignment;
