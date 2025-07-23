import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const grade = await db.gradeList.create({
      data: {
        name,
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.log("[GRADES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const grades = await db.gradeList.findMany();

    return NextResponse.json(grades);
  } catch (error) {
    console.log("[GRADES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
