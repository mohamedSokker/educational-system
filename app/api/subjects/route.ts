import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name, gradeId, description } = body;
    console.log("Creating class with data:", body);

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!gradeId) {
      return new NextResponse("Grade id is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }

    const subjects = await db.subject.create({
      data: {
        name,
        gradeId,
        description,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.log("[SUBJECTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const subjects = await db.subject.findMany();

    return NextResponse.json(subjects);
  } catch (error) {
    console.log("[SUBJECTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
