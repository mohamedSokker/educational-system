import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!session?.user.id) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);
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

    const { name, email, image } = body;

    if (!session?.user.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // if (!image) {
    //   return new NextResponse("Image Url is required", { status: 400 });
    // }

    if (!id) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await db.user.updateMany({
      where: {
        id: id,
      },
      data: { name: name, email: email, image: image },
    });

    // if (role === "Student") {
    //   await db.student.create({
    //     data: {
    //       userId: id,
    //       name: name,
    //     },
    //   });
    // } else if (role === "Teacher") {
    //   await db.teacher.create({
    //     data: {
    //       userId: id,
    //       name: name,
    //     },
    //   });
    // } else {
    //   await db.admin.create({
    //     data: {
    //       userId: id,
    //       name: name,
    //     },
    //   });
    // }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PATCH]", error);
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

    if (!session?.user.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!id) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await db.user.deleteMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
