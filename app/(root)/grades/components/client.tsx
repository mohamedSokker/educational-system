"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { GradeList } from "@prisma/client";

interface GradesClientProps {
  data: GradeList[];
}

export const GradesClient: React.FC<GradesClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Grades (${data.length})`}
          description="Manage Grade List"
        />
        <Button onClick={() => router.push(`/grades/new`)} variant="outline">
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
