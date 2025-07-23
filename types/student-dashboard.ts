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
} from "@prisma/client";

export type StudentDashboardData = {
  userName: string;
  userRole: string;
  student:
    | ({
        class:
          | ({
              assignments: Assignment[];
            } & Class)
          | null;
        grade:
          | ({
              subjects: Subject[];
              exams: Exam[];
              courses: Textbook[];
            } & GradeList)
          | null;
        submissions: Submission[];
        examAttempts: ExamAttempt[];
        certificates: Certificate[];
      } & Student)
    | null;
  teachers: Teacher;
};
