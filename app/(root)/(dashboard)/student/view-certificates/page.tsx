import { auth } from "@/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentDashboardData } from "@/hooks/use-student-dashboard";
import { db } from "@/lib/db";
import { AlertCircleIcon, ArrowRight } from "lucide-react";
import CertificateBtn from "./components/certificate-btn";

const ViewCertificates = async () => {
  const session = await auth();
  const [student] = await Promise.all([
    await db.student.findFirst({
      where: { name: session?.user.name as string },
      include: {
        certificates: { include: { exam: { include: { teacher: true } } } },
        examAttempts: true,
      },
    }),
  ]);

  const getCertificateGrade = (examId: string) => {
    let result = 0;
    student?.examAttempts.map((ex) => {
      if (ex.examId === examId) result += Number(ex.score);
    });
    return result;
  };
  return (
    <div className="flex w-full justify-center items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your certificates</CardTitle>
          <CardDescription>{`Congratulation you got ${student?.certificates.length} certificates`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {student?.certificates.map((cer) => (
              <Card key={cer.id}>
                <CardHeader>
                  <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-[14px]">{cer.exam?.title}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {cer.exam?.description}
                      </p>
                      <Badge variant="secondary">
                        {cer.exam?.teacher.name}
                      </Badge>
                      <Badge variant="outline">
                        {`${getCertificateGrade(cer.exam?.id as string)} %`}
                      </Badge>
                    </div>
                    <CertificateBtn certificateId={cer.id} />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewCertificates;
