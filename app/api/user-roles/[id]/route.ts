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

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERROLES_GET]", error);
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

    const { name, role } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!role || role === "") {
      return new NextResponse("Role is required", { status: 400 });
    }

    if (!id) {
      return new NextResponse("id is required", { status: 400 });
    }

    if (role === "Student") {
      const existingStudent = await db.student.findFirst({
        where: { name: name },
      });
      await db.teacher.deleteMany({
        where: { name: name },
      });
      await db.admin.deleteMany({
        where: { name: name },
      });
      if (!existingStudent) {
        await db.student.create({
          data: {
            name: name,
            userId: id,
          },
        });
      }
    } else if (role === "Teacher") {
      const existingTeacher = await db.teacher.findFirst({
        where: { name: name },
      });
      await db.student.deleteMany({
        where: { name: name },
      });
      await db.admin.deleteMany({
        where: { name: name },
      });
      if (!existingTeacher) {
        await db.teacher.create({
          data: {
            name: name,
            userId: id,
          },
        });
      }
    } else if (role === "Admin") {
      const existingAdmin = await db.admin.findFirst({
        where: { name: name },
      });
      await db.teacher.deleteMany({
        where: { name: name },
      });
      await db.student.deleteMany({
        where: { name: name },
      });
      if (!existingAdmin) {
        await db.admin.create({
          data: {
            name: name,
            userId: id,
          },
        });
      }
    }

    const user = await db.user.updateMany({
      where: {
        id: id,
      },
      data: { role: role },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERROLES_PATCH]", error);
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

    const user = await db.user.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERROLES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
