import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    console.log(body);

    const { studentId, assignmentId, fileUrl } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!assignmentId) {
      return new NextResponse("Assignment id is required", { status: 400 });
    }

    if (!fileUrl) {
      return new NextResponse("File is required", { status: 400 });
    }

    if (!studentId) {
      return new NextResponse("Student id is required", { status: 400 });
    }

    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        title: true,
        description: true,
        teacher: {
          select: {
            userId: true, // user who will receive the notification
          },
        },
      },
    });

    if (assignment?.teacher?.userId) {
      await db.notification.create({
        data: {
          userId: assignment.teacher.userId,
          action: `A student submitted "${assignment.title}"`,
          target: `submission:${assignment.description}`,
        },
      });
    }

    const submittion = await db.submission.create({
      data: {
        studentId,
        assignmentId,
        fileUrl,
      },
    });

    return NextResponse.json(submittion);
  } catch (error) {
    console.log("[SUBMIT_ASSIGNMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
