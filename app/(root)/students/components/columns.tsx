"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { CellAction } from "./cell-actions";
import { Button } from "@/components/ui/button";

export type StudentColumn = {
  id: string;
  name: string;
  gradeLabel: string | undefined;
  classId: string | null;
  className: string | undefined;
  gradeId: string | null;
};

export const columns: ColumnDef<StudentColumn>[] = [
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
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => row.original.className,
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => row.original.gradeLabel,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
