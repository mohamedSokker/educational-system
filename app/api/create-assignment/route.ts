import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    console.log(body);

    const { title, description, dueDate, classId, teacherId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!classId) {
      return new NextResponse("Class id is required", { status: 400 });
    }

    if (!teacherId) {
      return new NextResponse("Teacher id is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description id is required", { status: 400 });
    }

    if (!dueDate) {
      return new NextResponse("Due Date id is required", { status: 400 });
    }

    const students = await db.student.findMany({
      where: {
        classId: classId,
      },
      select: {
        userId: true,
      },
    });

    if (students.length > 0) {
      const notificationsData = students.map((student) => ({
        userId: student.userId,
        action: `New assignment (${title}) was posted`,
        target: `assignment:${description}`,
      }));

      await db.notification.createMany({
        data: notificationsData,
        skipDuplicates: true,
      });
    }

    const assignments = await db.assignment.create({
      data: {
        title,
        description,
        dueDate,
        classId,
        teacherId,
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.log("[ASSIGNMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
