"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ClassClientProps {
  data: ClassColumn[];
}

export const ClassClient: React.FC<ClassClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Classes (${data.length})`}
          description="Manage Class List"
        />
        <Button onClick={() => router.push(`/classes/new`)} variant="outline">
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
