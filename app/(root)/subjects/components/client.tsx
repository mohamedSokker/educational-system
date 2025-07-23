"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubjectColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface SubjectClientProps {
  data: SubjectColumn[];
}

export const SubjectClient: React.FC<SubjectClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Subjects (${data.length})`}
          description="Manage Subjects List"
        />
        <Button onClick={() => router.push(`/subjects/new`)} variant="outline">
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
