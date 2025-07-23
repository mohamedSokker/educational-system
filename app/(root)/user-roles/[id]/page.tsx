import { UserRolesForm } from "./components/user-roles-form";
import { db } from "@/lib/db";

const UserRolesPage = async ({
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
        <UserRolesForm initialData={user} role="Student" />
      </div>
    </div>
  );
};

export default UserRolesPage;
