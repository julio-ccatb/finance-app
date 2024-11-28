import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Roles } from "drizzle/schemas/roles";
import { type userSelectInput } from "drizzle/schemas/schema";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ChangeRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: userSelectInput | null;
  onRoleChange: (userId: string, newRole: Roles) => void;
  availableRoles: Roles[];
}

export function ChangeRoleDialog({
  isOpen,
  onOpenChange,
  selectedUser,
  onRoleChange,
  availableRoles,
}: ChangeRoleDialogProps) {
  const [newRole, setNewRole] = useState<Roles | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setNewRole(selectedUser.roles ?? "NOT_VERIFIED");
    }
  }, [selectedUser]);

  const handleRoleChange = () => {
    if (!newRole) {
      setError("Por favor, selecciona un rol antes de continuar.");
      return;
    }
    if (!selectedUser) {
      setError("No se ha seleccionado ningún usuario.");
      return;
    }
    if (newRole === selectedUser.roles) {
      setError("El nuevo rol debe ser diferente al rol actual.");
      return;
    }
    setError(null);
    onRoleChange(selectedUser.id, newRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
          <DialogDescription>
            Selecciona un nuevo rol para el usuario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedUser && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Usuario:</Label>
              <div className="col-span-3">
                <p>{selectedUser.name}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <p className="text-sm text-gray-500">
                  Rol actual: {selectedUser.roles}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Nuevo Rol
            </Label>
            <Select
              onValueChange={(value) => setNewRole(value as Roles)}
              value={newRole}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un nuevo rol" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleRoleChange}>Cambiar Rol</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
