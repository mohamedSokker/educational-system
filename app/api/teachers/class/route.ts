import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { classId, teacherId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!classId) {
      return new NextResponse("Class id is required", { status: 400 });
    }

    if (!teacherId) {
      return new NextResponse("Teacher id is required", { status: 400 });
    }

    const teachers = await db.teacherClass.create({
      data: {
        classId: classId,
        teacherId: teacherId,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.log("[TEACHERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const teachers = await db.teacherClass.findMany();

    return NextResponse.json(teachers);
  } catch (error) {
    console.log("[TEACHERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
