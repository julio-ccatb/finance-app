"use client";

import { ROUTES } from "@/app/_components/utils/routes";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { ChangeRoleDialog } from "@/components/users/users-ChangeRolDialog";
import { UserTable } from "@/components/users/users-table";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { type Roles } from "drizzle/schemas/roles";
import { type userSelectInput } from "drizzle/schemas/schema";
import { useState } from "react";

export default function UserManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userSelectInput | null>(
    null,
  );

  const { data: users, refetch: refetchUsers } = api.users.list.useQuery();
  const roles: Roles[] = [
    "NOT_VERIFIED",
    "ADMIN",
    "EDITOR",
    "OPERATOR",
    "READER",
    "VIEWER",
  ];
  const { mutate: addRole } = api.users.updateRole.useMutation({
    onSuccess: () => {
      void refetchUsers();
      toast({ title: "Rol añadido con éxito" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error al añadir rol",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddRole = (userId: string, newRole: Roles) => {
    if (selectedUser && newRole) {
      addRole({ id: userId, role: newRole });
    }
  };

  const handleRemoveRole = (userId: string, role: Roles) => {
    // Implement role removal logic here
    console.log(`Removing role ${role} from user ${userId}`);
  };

  if (!users) return <p>Cargando usuarios...</p>;

  return (
    <div className="px-2">
      <PageHeader
        breadcrumbs={[
          { label: "panel", href: "/dashboard" },
          { label: "Ajustes", href: ROUTES.SETTINGS_USERS },
        ]}
      >
        <ThemeToggle />
      </PageHeader>

      <UserTable
        availableRoles={roles}
        users={users}
        onAddRole={(user) => {
          setSelectedUser(user);
          setIsDialogOpen(true);
        }}
        onRemoveRole={handleRemoveRole}
      />

      <ChangeRoleDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedUser={selectedUser}
        availableRoles={roles}
        onRoleChange={handleAddRole}
      />
    </div>
  );
}
