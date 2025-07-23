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

    const subjects = await db.subject.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.log("[SUBJECTS_GET]", error);
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

    const { name, gradeId, description } = body;

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

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    const subjects = await db.subject.updateMany({
      where: {
        id: id,
      },
      data: { name: name, gradeId: gradeId, description: description },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.log("[SUBJECTS_PATCH]", error);
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

    const subjects = await db.subject.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.log("[SUBJECTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
