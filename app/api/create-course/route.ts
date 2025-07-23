import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { title, subjectId, gradeId, teacherId, fileUrl } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!fileUrl) {
      return new NextResponse("File is required", { status: 400 });
    }

    if (!gradeId) {
      return new NextResponse("Class id is required", { status: 400 });
    }

    if (!subjectId) {
      return new NextResponse("Subject id is required", { status: 400 });
    }

    if (!teacherId) {
      return new NextResponse("Teacher id is required", { status: 400 });
    }

    const students = await db.student.findMany({
      where: {
        gradeId: gradeId,
      },
      select: {
        userId: true,
      },
    });

    if (students.length > 0) {
      const notificationsData = students.map((student) => ({
        userId: student.userId,
        action: `New course (${title}) was created`,
        target: `course:${title}`,
      }));

      await db.notification.createMany({
        data: notificationsData,
        skipDuplicates: true,
      });
    }

    const courses = await db.textbook.create({
      data: {
        title,
        gradeId,
        subjectId,
        teacherId,
        fileUrl,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.log("[CREATE_COURSE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
