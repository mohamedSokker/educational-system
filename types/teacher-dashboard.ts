import {
  Assignment,
  Class,
  Exam,
  GradeList,
  Student,
  Subject,
  Submission,
  Teacher,
  TeacherClass,
} from "@prisma/client";

export type TeacherDashboardData = {
  userName: string;
  userRole: string;
  grade: string;
  teacherStudents: number;
  totalAssignments: number;
  teachers:
    | ({
        teacherClass: ({
          class: {
            assignments: Assignment[];
            students: Student[];
            grade: GradeList;
          } & Class;
        } & TeacherClass)[];
        subjects: Subject | null;
        assignments: Assignment[];
        exams: Exam[];
      } & Teacher)
    | null;
  submittions: ({
    student: {
      user: {
        name: string;
        email: string;
      };
    } & {
      name: string;
      id: string;
      userId: string;
      classId: string | null;
      gradeId: string | null;
      enrollmentDate: Date;
    };
    assignment: {
      title: string;
      description: string;
    };
  } & Submission)[];
  examAttempts: { studentId: string; score: number | null }[];
  //   avgScore: number;
};

export type TeacherHeaderDashboardData = {
  userName: string;
  userRole: string;
  grade: string;
  teachers:
    | ({
        teacherClass: ({
          class: {
            assignments: Assignment[];
            students: Student[];
            grade: GradeList;
          } & Class;
        } & TeacherClass)[];
        subjects: Subject | null;
        assignments: Assignment[];
        exams: Exam[];
      } & Teacher)
    | null;
};
