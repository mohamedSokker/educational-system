import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    console.log(body);

    const { studentId, examId, score, totalMark } = body;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!score) {
      return new NextResponse("Score is required", { status: 400 });
    }

    if (!totalMark) {
      return new NextResponse("Total Mark is required", { status: 400 });
    }

    if (!studentId) {
      return new NextResponse("Student id is required", { status: 400 });
    }

    if (!examId) {
      return new NextResponse("Exam id is required", { status: 400 });
    }

    const exam = await db.exam.findUnique({
      where: { id: examId },
      select: {
        id: true,
        title: true,
        description: true,
        teacher: {
          select: {
            userId: true, // user who will receive the notification
          },
        },
      },
    });

    if (exam?.teacher?.userId) {
      await db.notification.create({
        data: {
          userId: exam.teacher.userId,
          action: `A student submitted "${exam.title}"`,
          target: `submission:${exam.description}`,
        },
      });
    }

    const scorePercentage = (score / totalMark) * 100;

    const exams = await db.examAttempt.create({
      data: {
        studentId,
        examId,
        score: scorePercentage,
      },
    });

    if (scorePercentage > 85) {
      await db.certificate.create({
        data: {
          studentId,
          examId,
        },
      });
    }

    return NextResponse.json(exams);
  } catch (error) {
    console.log("[TAKE_EXAM_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
