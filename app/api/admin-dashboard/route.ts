import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const [examAttempts, teachers, students, users, courses, assignments] =
      await Promise.all([
        await db.examAttempt.findMany(),
        await db.teacher.findMany(),
        await db.student.findMany(),
        await db.user.findMany(),
        await db.textbook.findMany(),
        await db.assignment.findMany(),
      ]);

    return NextResponse.json({
      userName: session?.user.name,
      userRole: session?.user.role,
      users: users,
      teachers: teachers,
      students: students,
      examAttempts: examAttempts,
      courses: courses,
      assignments: assignments,
    });
  } catch (error) {
    console.log("[ADMIN_DASHBOARD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
