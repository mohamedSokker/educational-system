import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const [student, teachers] = await Promise.all([
      await db.student.findFirst({
        where: { name: session?.user.name as string },
        include: {
          certificates: true,
          examAttempts: true,
          class: { include: { assignments: true } },
          grade: { include: { subjects: true, exams: true, courses: true } },
          submissions: true,
        },
      }),
      await db.teacher.findMany(),
    ]);

    console.log(student);

    // const classes = allClasses.filter((cl) =>
    //   teachers.some((t) => t.classId === cl.id)
    // );

    // const teacherGrade = classes[0]?.grade?.name;

    // const teacherStudents = classes.reduce(
    //   (acc, curr) => acc + curr.students.length,
    //   0
    // );
    // const studentsIds: string[] = [];
    // classes.map((cl) =>
    //   cl.students.map((s) => {
    //     studentsIds.push(s.id);
    //   })
    // );

    // const submittions = await db.submission.findMany({
    //   where: { studentId: { in: studentsIds } },
    //   select: { grade: true, studentId: true },
    // });
    // const examAttempts = await db.examAttempt.findMany({
    //   where: { studentId: { in: studentsIds } },
    //   select: { score: true, studentId: true },
    // });

    // const totalAssignments = teachers.reduce(
    //   (acc, curr) => acc + curr.assignments.length,
    //   0
    // );

    return NextResponse.json({
      userName: session?.user.name,
      userRole: session?.user.role,
      student: student,
      teachers: teachers,
      //   grade: teacherGrade,
      //   teacherStudents: teacherStudents,
      //   totalAssignments: totalAssignments,
      //   classes: classes,
      //   teachers: teachers,
      //   submittions: submittions,
      //   examAttempts: examAttempts,
    });
  } catch (error) {
    console.log("[STUDENT_DASHBOARD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
