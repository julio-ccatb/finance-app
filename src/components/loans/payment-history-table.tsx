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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { CalendarIcon, FilterIcon, XCircleIcon, X } from "lucide-react";

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

  const getFilterBadgeLabel = (columnId: string, value: string) => {
    if (columnId === "status") return getStatusText(value);
    if (columnId === "paymentType") return getPaymentTypeText(value);
    return value;
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
      filterFn: (
        row,
        columnId,
        filterValue: { start: Date | undefined; end: Date | undefined },
      ) => {
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

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Historial de Pagos</CardTitle>
        <CardDescription>
          Registro de todos los pagos realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate && endDate ? (
                    <>
                      {format(startDate, "P", { locale: es })} -{" "}
                      {format(endDate, "P", { locale: es })}
                    </>
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0" align="start">
                <div className="flex flex-col gap-2 p-3">
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
              </PopoverContent>
            </Popover>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size={"icon"}>
                  <FilterIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Select
                    value={
                      (table.getColumn("status")?.getFilterValue() as string) ??
                      ""
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("status")
                        ?.setFilterValue(value === "ALL" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
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
                      (table
                        .getColumn("paymentType")
                        ?.getFilterValue() as string) ?? ""
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("paymentType")
                        ?.setFilterValue(value === "ALL" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      <SelectItem value="PAYMENT">Pago</SelectItem>
                      <SelectItem value="INTREST">Interés</SelectItem>
                      <SelectItem value="SURCHARGE">Recargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {table.getState().columnFilters.map((filter) => {
              if (filter.id !== "paymentDate") {
                return (
                  <Badge key={filter.id} variant="secondary" className="gap-1">
                    {getFilterBadgeLabel(filter.id, filter.value as string)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        table.getColumn(filter.id)?.setFilterValue(undefined)
                      }
                    />
                  </Badge>
                );
              }
              return null;
            })}
            {columnFilters.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                size={"icon"}
              >
                {/* Assuming FilterX is defined elsewhere */}
                {/* <FilterX /> */}
                <XCircleIcon className="mr-2 h-4 w-4" />
              </Button>
            )}
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
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
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
          <div className="flex items-center space-x-2">
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
