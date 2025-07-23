import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     const body = await req.json();

//     const { name } = body;

//     if (!session?.user?.id) {
//       return new NextResponse("Unauthenticated", { status: 401 });
//     }

//     if (!name) {
//       return new NextResponse("Role is required", { status: 400 });
//     }

//     const user = await db.user.create({
//       data: {
//         name,
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     console.log("[USERROLES_POST]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const users = await db.user.findMany();

    return NextResponse.json(users);
  } catch (error) {
    console.log("[USERROLES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
