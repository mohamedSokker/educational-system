"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CellAction } from "./cell-actions";
import { Button } from "@/components/ui/button";

export type TeacherColumn = {
  id: string;
  name: string;
  subjectLabel: string | undefined;
  classId: string | null;
  className: string | undefined;
  subjectId: string | null;
};

export const columns: ColumnDef<TeacherColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "class",
  //   header: "Class",
  //   cell: ({ row }) => row.original.className,
  // },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subjectLabel,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
