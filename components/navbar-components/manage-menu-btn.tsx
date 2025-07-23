"use client";

import React from "react";
import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { UserPenIcon } from "lucide-react";
import { redirect } from "next/navigation";

interface ManageAccountBtnProps {
  id: string | undefined;
}

const ManageAccountBtn = ({ id }: ManageAccountBtnProps) => {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
        <span onClick={() => redirect(`/manage-account/${id}`)}>
          Manage Account
        </span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};

export default ManageAccountBtn;
