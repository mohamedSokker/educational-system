import { db } from "@/lib/db";
import React from "react";
import { AccountForm } from "./components/account-form";

const ManageAccount = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const user = await db.user.findUnique({
    where: {
      id: id,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AccountForm initialData={user} />
      </div>
    </div>
  );
};

export default ManageAccount;
