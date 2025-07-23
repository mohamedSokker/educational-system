"use client";

import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogInIcon } from "lucide-react";
import { logout } from "@/actions/logout";

const Logout = () => {
  return (
    <DropdownMenuItem>
      <LogInIcon size={16} className="opacity-60" aria-hidden="true" />
      <span
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </span>
    </DropdownMenuItem>
  );
};

export default Logout;
