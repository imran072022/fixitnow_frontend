import { UsersList } from "./_components/UsersList";
import { getAdminUsersServer } from "./_data/users.server";

const ManageUsers = async () => {
  const { data: users } = await getAdminUsersServer();

  return (
    <div className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage users</h1>
        <p className="mt-2 text-muted-foreground">
          Review users and manage account access.
        </p>
      </div>
      <UsersList initialUsers={users} />
    </div>
  );
};

export default ManageUsers;
