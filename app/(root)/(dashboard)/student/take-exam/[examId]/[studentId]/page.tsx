import { db } from "@/lib/db";
import React from "react";
import { TakeExamForm } from "../../../components/exam-form";

const TakeExam = async ({
  params,
}: {
  params: Promise<{ examId: string; studentId: string }>;
}) => {
  const resolvedParams = await params;
  const { examId, studentId } = resolvedParams;

  const examData = await db.examForm.findMany({ where: { examId: examId } });
  const exam = await db.exam.findFirst({ where: { id: examId } });
  console.log(examData);
  return (
    <div className="flex-col w-full h-full">
      <div className="w-full h-full space-y-4 p-8 pt-6">
        <TakeExamForm
          exam={exam}
          examData={examData}
          studentId={studentId}
          examId={examId}
        />
      </div>
    </div>
  );
};

export default TakeExam;
