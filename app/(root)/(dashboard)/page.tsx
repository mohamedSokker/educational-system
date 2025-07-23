import { auth } from "@/auth";
import StudentsDashboards from "./components/student/students";
import TeachersDashboard from "./components/teacher/teachers";
import AdminsDashboard from "./components/admin/admins";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex items-center justify-center">
      {session?.user.role === "Admin" ? (
        <AdminsDashboard />
      ) : session?.user.role === "Teacher" ? (
        <TeachersDashboard />
      ) : (
        <StudentsDashboards />
      )}
    </div>
  );
}
