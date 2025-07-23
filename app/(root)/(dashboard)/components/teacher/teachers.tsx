"use client";

import TeacherHeader from "./components/Headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  ArrowRight,
  ChartColumn,
  Eye,
  FileChartColumnIncreasing,
  HardHatIcon,
  LandmarkIcon,
  User,
  Users,
} from "lucide-react";
import { useTeacherDashboardData } from "@/hooks/use-teacher-dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TeacherDashboardSkeleton from "./components/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TeachersDashboard = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useTeacherDashboardData();

  const unGradedSubmissions = data?.submittions.filter(
    (sub) => sub.grade === null
  );
  console.log(unGradedSubmissions);

  if (isLoading) return <TeacherDashboardSkeleton />;
  if (isError || !data)
    return (
      <div className="h-full flex items-center justify-center">
        <Alert variant="destructive" className="max-w-[600px]">
          <AlertCircleIcon />
          <AlertTitle>Unable to Fetch Data.</AlertTitle>
          <AlertDescription>
            <p>Please verify you are Connecting to internet and try again.</p>
            <ul className="list-inside list-disc text-sm">
              <li>Check your internet connection</li>
              <li>Contact support for server issues</li>
              <li>{error?.message}</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );

  const totalAssignmentsScore = data.submittions.reduce(
    (acc, curr) => acc + Number(curr.grade),
    0
  );
  const totalExamsScore = data.examAttempts.reduce(
    (acc, curr) => acc + Number(curr.score),
    0
  );

  // const totalPerformance =
  //   data.submittions.length + data.examAttempts.length > 0
  //     ? (totalAssignmentsScore + totalExamsScore) /
  //       (data.submittions.length + data.examAttempts.length)
  //     : 100;
  const totalPerformance =
    data.examAttempts.length > 0
      ? totalExamsScore / data.examAttempts.length
      : 100;

  const getClassScore = (studentIds: string[] | undefined) => {
    const studentsSubmittions = data.submittions.filter((sub) =>
      studentIds?.includes(sub.studentId)
    );
    const studentsExams = data.examAttempts.filter((sub) =>
      studentIds?.includes(sub.studentId)
    );
    const totalAssignmentsScore = studentsSubmittions.reduce(
      (acc, curr) => acc + Number(curr.grade),
      0
    );
    const totalExamsScore = studentsExams.reduce(
      (acc, curr) => acc + Number(curr.score),
      0
    );

    // const totalPerformance =
    //   studentsSubmittions.length + studentsExams.length > 0
    //     ? (totalAssignmentsScore + totalExamsScore) /
    //       (studentsSubmittions.length + studentsExams.length)
    //     : 100;
    const totalPerformance =
      studentsExams.length > 0 ? totalExamsScore / studentsExams.length : 100;

    return totalPerformance;
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <TeacherHeader
        grade={data?.grade}
        userName={data?.userName}
        userRole={data?.userRole}
        teachers={data?.teachers}
      />
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 px-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{data?.teacherStudents}</span>
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>Active Calsses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">
                {data?.teachers?.teacherClass.length}
              </span>
              <LandmarkIcon className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performace</CardTitle>
            <CardDescription>Average Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{`${totalPerformance} %`}</span>
              <ChartColumn className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Created Assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{data?.totalAssignments}</span>
              <FileChartColumnIncreasing className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full px-4">
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>
              Overview of your current classes and thier performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data?.teachers?.teacherClass.map((cl) => (
              <Card key={cl?.id}>
                <CardHeader>
                  <CardTitle>{`Class ${cl?.class.name} ${data.teachers?.subjects?.name}`}</CardTitle>
                  <CardDescription>{`${cl?.class?.students.length} Students`}</CardDescription>
                  <CardContent>
                    <div className="w-full grid grid-cols-3">
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <span>{cl?.class?.students.length}</span>
                        <span>Students</span>
                      </div>
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <span>{cl?.class.assignments.length}</span>
                        <span>Assignments</span>
                      </div>
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <span>
                          {`${getClassScore(
                            cl?.class?.students?.map((st) => st.id)
                          )} %`}
                        </span>
                        <span>Avg Grade</span>
                      </div>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="w-full px-4">
        <Card>
          <CardHeader>
            <CardTitle>UnGraded Assignments</CardTitle>
            <CardDescription>
              Overview of your current ungraded assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {unGradedSubmissions?.length === 0 ? (
              <Card className="w-full flex flex-row items-center justify-center">
                <CardContent>Nothing to show</CardContent>
              </Card>
            ) : (
              unGradedSubmissions?.map((cl) => (
                <Card key={cl?.id}>
                  <CardHeader>
                    <CardTitle>{`${cl.assignment.title}`}</CardTitle>
                    <CardDescription>{`${cl.assignment.description}`}</CardDescription>
                    <CardContent>
                      <div className="w-full flex flex-row justify-between items-center">
                        <div>{`${cl?.student.name} submit a new assignment`}</div>
                        <div className="flex flex-row gap-4 items-center">
                          <Button
                            variant="outline"
                            onClick={() => window.open(cl.fileUrl, "_blank")}
                          >
                            View
                            <Eye />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(`grade-assignment/${cl.assignmentId}`)
                            }
                          >
                            Grade
                            <ArrowRight />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeachersDashboard;
