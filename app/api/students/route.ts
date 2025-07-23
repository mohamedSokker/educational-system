import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name, classId, gradeId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // if (!classId) {
    //   return new NextResponse("Class id is required", { status: 400 });
    // }

    if (!gradeId) {
      return new NextResponse("Grade id is required", { status: 400 });
    }

    const currentStudent = await db.student.findFirst({
      where: {
        name: name,
      },
    });

    if (!currentStudent) {
      return new NextResponse("Student must create account first", {
        status: 400,
      });
    }

    const students = await db.student.create({
      data: {
        name,
        classId: classId ? classId : null,
        gradeId,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.log("[STUDENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const students = await db.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
