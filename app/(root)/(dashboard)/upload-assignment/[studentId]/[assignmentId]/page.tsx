import { db } from "@/lib/db";
import React from "react";
import { UploadAssignmentForm } from "./components/upload-assignment-form";

const ManageAccount = async ({
  params,
}: {
  params: Promise<{ studentId: string; assignmentId: string }>;
}) => {
  const resolvedParams = await params;
  const { studentId, assignmentId } = resolvedParams;

  const assignment = db.assignment.findUnique({
    where: { id: assignmentId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UploadAssignmentForm
          studentId={studentId}
          assignmentId={assignmentId}
        />
      </div>
    </div>
  );
};

export default ManageAccount;
