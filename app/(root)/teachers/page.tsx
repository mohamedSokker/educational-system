import { db } from "@/lib/db";

import { TeacherClient } from "./components/client";
import { TeacherColumn } from "./components/columns";
import { TeacherClassColumn } from "./components/columnsClass";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeacherClientClass } from "./components/clientClass";

const Teachers = async () => {
  const teachers = await db.teacher.findMany();

  const classes = await db.class.findMany();
  const subjects = await db.subject.findMany();
  const teachersClass = await db.teacherClass.findMany();

  const formattedClass: TeacherColumn[] = teachers.map((item) => ({
    id: item.id,
    name: item.name,
    subjectLabel: subjects?.find((t) => t.id == item.subjectId)?.name,
    classId: item.classId,
    className: classes?.find((t) => t.id == item.classId)?.name,
    subjectId: item.subjectId,
  }));

  const formattedTeacherClass: TeacherClassColumn[] = teachersClass.map(
    (item) => ({
      id: item.id,
      teacherLabel: teachers?.find((t) => t.id == item.teacherId)?.name,
      classId: item.classId,
      className: classes?.find((t) => t.id == item.classId)?.name,
      teacherId: item.teacherId,
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="Teacher">
          <TabsList>
            <TabsTrigger value="Teacher">Teacher</TabsTrigger>
            <TabsTrigger value="TeacherClass">TeacherClasses</TabsTrigger>
          </TabsList>
          <TabsContent value="Teacher">
            <TeacherClient data={formattedClass} />
          </TabsContent>
          <TabsContent value="TeacherClass">
            <TeacherClientClass data={formattedTeacherClass} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Teachers;
