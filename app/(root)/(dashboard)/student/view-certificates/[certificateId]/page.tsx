import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { GraduationCap } from "lucide-react";

import { format } from "date-fns";

const Certificate = async ({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) => {
  const resolvedParams = await params;
  const { certificateId } = resolvedParams;

  const [certificate] = await Promise.all([
    await db.certificate.findFirst({
      where: { id: certificateId },
      include: {
        exam: { include: { teacher: true } },
        student: { include: { examAttempts: true } },
      },
    }),
  ]);

  console.log(certificate);
  return (
    <div className="w-full flex flex-1 flex-col justify-center items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row justify-between items-center">
              <GraduationCap className="w-8 h-8" />
              <p>{`Student: ${certificate?.student.name}`}</p>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex flex-row justify-between items-center">
              <p>{`Teacher: ${certificate?.exam?.teacher.name}`}</p>
              <p>{`Exam: ${certificate?.exam?.title}`}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {`The school is congratulate (${
            certificate?.student.name
          }) for passing the exam ${
            certificate?.exam?.description
          } at (${format(
            certificate?.issuedAt as Date,
            "yyyy-MM-dd"
          )}) wish you more success in all exams`}
        </CardContent>
        <CardFooter className="w-full flex flex-row justify-center text-muted-foreground text-[14px]">{`Thank you alot for that great effort ${certificate?.student.name}`}</CardFooter>
      </Card>
    </div>
  );
};

export default Certificate;
