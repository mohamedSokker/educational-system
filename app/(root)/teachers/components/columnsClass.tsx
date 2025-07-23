"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CellActionClass } from "./cell-actionsClass";
import { Button } from "@/components/ui/button";

export type TeacherClassColumn = {
  id: string;
  teacherLabel: string | undefined;
  classId: string | null;
  className: string | undefined;
  teacherId: string | null;
};

export const columnsClass: ColumnDef<TeacherClassColumn>[] = [
  {
    accessorKey: "teacherLabel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teacher
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => row.original.className,
  },
  // {
  //   accessorKey: "subject",
  //   header: "Subject",
  //   cell: ({ row }) => row.original.subjectLabel,
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellActionClass data={row.original} />,
  },
];
