import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ notifications: notifications });
  } catch (error) {
    console.log("[NOTIFICATION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
