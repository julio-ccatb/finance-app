"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  type ColumnDef,
  type ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, subYears, addYears } from "date-fns";
import { es } from "date-fns/locale";
import { type PaymentsSelectInput } from "drizzle/schemas/payments";

interface PaymentHistoryTableProps {
  payments: PaymentsSelectInput[];
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const getPaymentTypeText = (paymentType: string) => {
    switch (paymentType) {
      case "PAYMENT":
        return "Pago";
      case "INTREST":
        return "Interés";
      case "SURCHARGE":
        return "Recargo";
      default:
        return "Desconocido";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completado";
      case "PENDING":
        return "Pendiente";
      case "EXPIRED":
        return "Expirado";
      default:
        return "Desconocido";
    }
  };

  const columns: ColumnDef<PaymentsSelectInput>[] = [
    {
      accessorKey: "paymentDate",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-nowrap">
          {row.original.paymentDate
            ? format(new Date(row.original.paymentDate), "P", { locale: es })
            : "N/A"}
        </span>
      ),
      filterFn: (row, columnId, filterValue: { start: Date; end: Date }) => {
        if (!filterValue.start || !filterValue.end) return true;
        const paymentDate = new Date(row.getValue(columnId));
        return (
          paymentDate >= filterValue.start && paymentDate <= filterValue.end
        );
      },
      sortDescFirst: true,
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => (
        <span>${parseFloat(row.original.amount).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "COMPLETED"
              ? "!bg-green-500"
              : row.original.status === "PENDING"
                ? "!bg-yellow-500"
                : "!bg-red-500"
          }
        >
          {getStatusText(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentType",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant="outline">
          {getPaymentTypeText(row.original.paymentType)}
        </Badge>
      ),
    },
  ];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    subYears(new Date(), 1),
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    addYears(new Date(), 1),
  );

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: "paymentDate",
          desc: true,
        },
      ],
    },
  });

  React.useEffect(() => {
    if (startDate && endDate) {
      table
        .getColumn("paymentDate")
        ?.setFilterValue({ start: startDate, end: endDate });
    } else {
      table.getColumn("paymentDate")?.setFilterValue(undefined);
    }
  }, [startDate, endDate, table]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Historial de Pagos</CardTitle>
        <CardDescription>
          Registro de todos los pagos realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-2 sm:flex-row">
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              placeholder="Fecha inicial"
            />
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              placeholder="Fecha final"
            />
          </div>
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="COMPLETED">Completado</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="EXPIRED">Expirado</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("paymentType")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("paymentType")
                ?.setFilterValue(value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="PAYMENT">Pago</SelectItem>
              <SelectItem value="INTREST">Interés</SelectItem>
              <SelectItem value="SURCHARGE">Recargo</SelectItem>
            </SelectContent>
          </Select>
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
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            de {table.getFilteredRowModel().rows.length} resultados
          </div>
          <div className="space-x-2">
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
      </CardContent>
    </Card>
  );
}
