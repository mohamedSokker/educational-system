import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const [teachers] = await Promise.all([
      await db.teacher.findFirst({
        where: { name: session?.user.name as string },
        include: {
          subjects: true,
          assignments: true,
          exams: true,
          teacherClass: {
            include: {
              class: {
                include: { students: true, grade: true, assignments: true },
              },
            },
          },
        },
      }),
    ]);

    const teacherGrade = teachers?.teacherClass?.[0].class.grade.name;

    const teacherStudents = teachers?.teacherClass.reduce(
      (acc, curr) => acc + curr.class.students.length,
      0
    );
    const studentsIds: string[] = [];
    teachers?.teacherClass.map((cl) =>
      cl.class.students.map((s) => {
        studentsIds.push(s.id);
      })
    );

    const submittions = await db.submission.findMany({
      where: {
        assignment: {
          teacherId: teachers?.id,
        },
      },
      include: {
        assignment: {
          select: {
            title: true,
            description: true,
          },
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    // const submittions = await db.submission.findMany({
    //   where: { studentId: { in: studentsIds } },
    //   select: { grade: true, studentId: true },
    // });
    const examAttempts = await db.examAttempt.findMany({
      where: { studentId: { in: studentsIds } },
      select: { score: true, studentId: true },
    });

    const totalAssignments = teachers?.assignments.length;

    return NextResponse.json({
      userName: session?.user.name,
      userRole: session?.user.role,
      grade: teacherGrade,
      teacherStudents: teacherStudents,
      totalAssignments: totalAssignments,
      teachers: teachers,
      submittions: submittions,
      examAttempts: examAttempts,
      // avgScore: avgScore,
    });
  } catch (error) {
    console.log("[TEACHERS_DASHBOARD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
