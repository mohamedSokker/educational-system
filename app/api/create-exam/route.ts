import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import cuid from "cuid";

interface Question {
  examId: string;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: string;
  mark: number;
}

type ExamRequestBody = {
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  subjectId: string;
  teacherId: string;
  gradeId: string;
  questions: Question[];
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    console.log(body);

    const {
      title,
      description,
      duration,
      totalMarks,
      subjectId,
      teacherId,
      gradeId,
      questions,
    } = body as ExamRequestBody;

    if (!session?.user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    if (!gradeId) {
      return new NextResponse("Grade id is required", { status: 400 });
    }

    if (!subjectId) {
      return new NextResponse("Subject id is required", { status: 400 });
    }

    if (!teacherId) {
      return new NextResponse("Teacher id is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description id is required", { status: 400 });
    }

    if (!duration) {
      return new NextResponse("Duration is required", { status: 400 });
    }

    if (!totalMarks) {
      return new NextResponse("Total Marks is required", { status: 400 });
    }

    const students = await db.student.findMany({
      where: {
        gradeId: gradeId,
      },
      select: {
        userId: true,
      },
    });

    if (students.length > 0) {
      const notificationsData = students.map((student) => ({
        userId: student.userId,
        action: `New exam (${title}) was created`,
        target: `exam:${description}`,
      }));

      await db.notification.createMany({
        data: notificationsData,
        skipDuplicates: true,
      });
    }

    const examId = await cuid();

    const exam = await db.exam.create({
      data: {
        id: examId,
        title,
        description,
        duration,
        totalMarks,
        teacherId,
        subjectId,
        gradeId,
      },
    });

    const examQuestions = questions.map((q) => {
      return {
        examId: examId,
        question: q.question,
        choices: [q.choice1, q.choice2, q.choice3, q.choice4],
        correctAnswer: q.correctAnswer,
        mark: q.mark,
      };
    });

    const examForm = await db.examForm.createMany({
      data: examQuestions,
    });

    // const assignments = await db.assignment.create({
    //   data: {
    //     title,
    //     description,
    //     dueDate,
    //     classId,
    //     teacherId,
    //   },
    // });

    return NextResponse.json(examForm);
  } catch (error) {
    console.log("[CREATE_EXAM_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
