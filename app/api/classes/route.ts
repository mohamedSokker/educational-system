import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name, gradeId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!gradeId) {
      return new NextResponse("Grade id is required", { status: 400 });
    }

    const classes = await db.class.create({
      data: {
        name,
        gradeId,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.log("[CLASS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const classes = await db.class.findMany();

    return NextResponse.json(classes);
  } catch (error) {
    console.log("[CLASSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
