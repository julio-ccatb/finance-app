import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import { type Roles } from "drizzle/schemas/roles";
import { type userSelectInput } from "drizzle/schemas/schema";
import React, { useCallback, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserTableProps {
  users: userSelectInput[];
  onAddRole: (user: userSelectInput) => void;
  onRemoveRole: (userId: string, role: Roles) => void;
  availableRoles: Roles[];
}

export function UserTable({
  users,
  onAddRole,
  // onRemoveRole,
  availableRoles,
}: UserTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<Roles | "all">("all");

  const columns: ColumnDef<userSelectInput>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => (
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={row.original.image ?? ""}
                alt={`Avatar de ${row.original.name}`}
              />
              <AvatarFallback>
                {row.original.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-none">
                {row.original.name?.substring(0, 16)}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
              <Badge variant="secondary" className="mt-1 w-fit">
                {row.original.roles}
              </Badge>
            </div>
          </div>
        ),
      },
      //   {
      //     accessorKey: "email",
      //     header: "Email",
      //     cell: ({ row }) => (
      //       <p className="text-nowrap font-mono text-sm">{row.original.email}</p>
      //     ),
      //   },
      //   {
      //     accessorKey: "rolev2",
      //     header: "Roles",
      //     cell: ({ row }) => (
      //       <div className="flex flex-wrap gap-1">
      //         <Badge
      //           key={row.original.rolev2}
      //           variant="secondary"
      //           className="mr-1"
      //         >
      //           {row.original.rolev2}
      //           <button
      //             onClick={() =>
      //               onRemoveRole(row.original.id, row.original.rolev2)
      //             }
      //             className="ml-1 text-red-500 hover:text-red-700"
      //             aria-label={`Eliminar rol ${row.original.rolev2}`}
      //           >
      //             <Trash2 size={12} />
      //           </button>
      //         </Badge>
      //       </div>
      //     ),
      //   },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddRole(row.original)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Cambiar Rol
          </Button>
        ),
      },
    ],
    [onAddRole],
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesGlobal =
        globalFilter === "" ||
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase()),
        );
      const matchesRole = roleFilter === "all" || user.roles === roleFilter;
      return matchesGlobal && matchesRole;
    });
  }, [users, globalFilter, roleFilter]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleGlobalFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(e.target.value);
    },
    [],
  );

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value as Roles | "all");
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="global-filter">Búsqueda general</Label>
          <Input
            id="global-filter"
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            placeholder="Buscar en todos los campos"
          />
        </div>
        <div>
          <Label htmlFor="role-filter">Filtrar por Rol</Label>
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger id="role-filter">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
