import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { assignmentId, grade } = body;
    console.log(body);

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!assignmentId) {
      return new NextResponse("Assignment id is required", { status: 400 });
    }

    if (!grade) {
      return new NextResponse("Grade is required", { status: 400 });
    }

    const student = await db.submission.findFirst({
      where: { assignmentId: assignmentId },
      include: { student: true, assignment: true },
    });

    if (student) {
      const notificationsData = {
        userId: student.student.userId,
        action: `Your assignment (${student.assignment.title}) was graded`,
        target: `assignment grade:${grade}`,
      };
      await db.notification.create({
        data: notificationsData,
      });
    }

    const grading = await db.submission.updateMany({
      data: { assignmentId: assignmentId, grade: grade },
      where: { assignmentId: assignmentId },
    });

    return NextResponse.json(grading);
  } catch (error) {
    console.log("[GRADING_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
