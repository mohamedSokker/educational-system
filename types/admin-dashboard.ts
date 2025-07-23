import {
  Assignment,
  Certificate,
  Class,
  Exam,
  ExamAttempt,
  GradeList,
  Student,
  Subject,
  Submission,
  Teacher,
  Textbook,
  User,
} from "@prisma/client";

export type AdminDashboardData = {
  userName: string;
  userRole: string;
  users: User[];
  students: Student[];
  teachers: Teacher[];
  examAttempts: ExamAttempt[];
  courses: Textbook[];
  assignments: Assignment[];
};

export interface BarChartData {
  student: string;
  performance: number;
}
