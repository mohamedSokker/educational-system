import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const teachers = await db.teacher.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.log("[TEACHERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const body = await req.json();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { name, subjectId } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // if (!classId) {
    //   return new NextResponse("Class id is required", { status: 400 });
    // }

    if (!subjectId) {
      return new NextResponse("Subject id is required", { status: 400 });
    }

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const teachers = await db.teacher.updateMany({
      where: {
        id: id,
      },
      data: { name, subjectId },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.log("[TEACHERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const teachers = await db.teacher.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.log("[TEACHERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
