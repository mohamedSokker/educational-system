import { db } from "@/lib/db";
import { auth } from "@/auth";

import { ExamsForm } from "./components/form";

const CreateExam = async () => {
  const session = await auth();
  const [teachers] = await Promise.all([
    await db.teacher.findFirst({
      where: { name: session?.user.name as string },
      include: { subjects: true, teacherClass: { include: { class: true } } },
    }),
  ]);

  const allClasses = await db.class.findMany({
    include: {
      grade: true,
    },
  });

  const classes = allClasses.filter((cl) =>
    teachers?.teacherClass.some((t) => t.classId === cl.id)
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ExamsForm
          classes={classes}
          teacherId={teachers?.id as string}
          gradeId={classes[0]?.grade?.id}
          subjectId={teachers?.subjects?.id}
        />
      </div>
    </div>
  );
};

export default CreateExam;
