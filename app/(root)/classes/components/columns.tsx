"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CellAction } from "./cell-actions";
import { Button } from "@/components/ui/button";

export type ClassColumn = {
  id: string;
  name: string;
  gradeLabel: string;
  createdAt: Date;
  teacherId: string | null;
  teacherName: string | undefined;
  studentId: string | null;
  studentName: string | undefined;
  gradeId: string;
};

export const columns: ColumnDef<ClassColumn>[] = [
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
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => row.original.gradeLabel,
  },
  // {
  //   accessorKey: "teacher",
  //   header: "Teacher",
  //   cell: ({ row }) => row.original.teacherName,
  // },
  // {
  //   accessorKey: "student",
  //   header: "Student",
  //   cell: ({ row }) => row.original.studentName,
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
