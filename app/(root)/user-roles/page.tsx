import { db } from "@/lib/db";

import { UserRoleClient } from "./components/client";

const UserRoles = async () => {
  const users = await db.user.findMany();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserRoleClient data={users} />
      </div>
    </div>
  );
};

export default UserRoles;
