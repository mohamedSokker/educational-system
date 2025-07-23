"use client";

import { format } from "date-fns";
import TeacherDashboardSkeleton from "../teacher/components/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircleIcon,
  ArrowRight,
  Book,
  ChartColumn,
  Clock,
  FileChartColumnIncreasing,
  FileText,
  GraduationCap,
  LandmarkIcon,
  Upload,
  Users,
} from "lucide-react";
import StudentHeader from "./components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAdminDashboardData } from "@/hooks/use-admin-dashboard";
import { ChartAreaInteractive } from "./components/area-chart";
import { BarChartData } from "@/types/admin-dashboard";

const AdminDashboards = () => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAdminDashboardData();
  console.log(data);

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

  const getTotals = () => {
    let performance = 0;
    const scoreSum = data?.examAttempts?.reduce(
      (acc, curr) => acc + Number(curr.score),
      0
    ) as number;
    const scoreCount = Number(data?.examAttempts?.length);

    performance = scoreCount > 0 ? scoreSum / scoreCount : 100;

    return { performance };
  };

  const totals = getTotals();

  const barChartData: BarChartData[] = [];

  data?.examAttempts?.forEach((ex) => {
    const student = data?.students.find(
      (student) => student.id === ex.studentId
    )?.name as string;
    const performance = ex.score as number;
    barChartData.push({ student: student, performance: performance });
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <StudentHeader userName={data?.userName} userRole={data?.userRole} />

      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 px-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Total Assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{data?.assignments?.length}</span>
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Active Courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{data?.courses?.length}</span>
              <Book className="w-5 h-5" />
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
              <span className="text-3xl">{`${totals.performance} %`}</span>
              <ChartColumn className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full flex items-center justify-between">
              <span className="text-3xl">{data?.users?.length}</span>
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full px-4">
        <ChartAreaInteractive barChartData={barChartData} />
      </div>

      {/* <div className="w-full px-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Keep track of your pending assignments and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data?.student?.class?.assignments.map((cl) => (
              <Card
                key={cl?.id}
                className="flex flex-row justify-between items-center p-4"
              >
                <div className="flex flex-row gap-4 items-center">
                  <Clock className="w-4 h-4" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-bold">{cl.description}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {cl.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-bold">
                      {format(cl.dueDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                  <Badge variant="outline">{getAssignmentStatus(cl.id)}</Badge>
                  <div>
                    {getAssignmentStatus(cl.id) === "Pending" ? (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(
                            `/upload-assignment/${data.student?.id}/${cl.id}`
                          )
                        }
                      >
                        <Upload />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="bg-emerald-500"
                      >{`Finished`}</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div> */}

      {/* <div className="w-full px-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>
              Keep track of your pending exams and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.student?.grade?.exams.map((cl) => (
              <Card
                key={cl?.id}
                className="flex flex-row justify-between items-center p-4"
              >
                <div className="flex flex-row gap-4 items-center">
                  <Clock className="w-4 h-4" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-bold">{cl.description}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {cl.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-bold">
                      {`${getExamSubject(cl.subjectId)}`}
                    </p>
                  </div>
                  <Badge variant="outline">{getExamStatus(cl.id)}</Badge>
                  <div>
                    {getExamStatus(cl.id) === "Pending" ? (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          router.push(
                            `/student/take-exam/${cl.id}/${data.student?.id}`
                          )
                        }
                      >
                        <ArrowRight />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="bg-emerald-500"
                      >{`Finished ${getExamGrade(cl.id)} %`}</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default AdminDashboards;
