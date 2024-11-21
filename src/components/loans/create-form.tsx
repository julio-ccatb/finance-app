"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type LoansCreateInput,
  LoansInsertSchema,
} from "drizzle/schemas/loans";
import { loanStatusArray } from "drizzle/schemas/loan-status";

const formSchema = LoansInsertSchema;

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  borrowerId: string;
  onCreateLoan: (loan: LoansCreateInput) => void;
}

export function CreateLoanModal({
  borrowerId,
  isOpen,
  onClose,
  onCreateLoan,
}: CreateLoanModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowerId,
      amount: "",
      interestRate: "",
      status: "ACTIVE",
    },
  });

  useEffect(
    () => form.setValue("borrowerId", borrowerId, { shouldValidate: true }),
    [],
  );

  console.log(form.formState.errors);
  function onSubmit(values: z.infer<typeof formSchema>) {
    const loan: LoansCreateInput = {
      borrowerId,
      amount: values.amount,
      startDate: values.startDate,
      dueDate: values.dueDate,
      interestRate: values.interestRate ?? null,
      status: values.status ?? undefined,
    };
    onCreateLoan(loan);
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-11/12 max-w-md sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Crear Nuevo Préstamo
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Ingrese los detalles del nuevo préstamo. Haga clic en crear cuando
            termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Monto</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} className="w-full" />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Ingrese el monto del préstamo en pesos.
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">
                      Fecha de Inicio
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "P")
                            ) : (
                              <span>Seleccionar</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(e) =>
                            e
                              ? form.setValue("startDate", e.toDateString(), {
                                  shouldValidate: true,
                                })
                              : ""
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">
                      Fecha de Vencimiento
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "P")
                            ) : (
                              <span>Seleccionar</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(e) =>
                            e
                              ? form.setValue("dueDate", e.toDateString(), {
                                  shouldValidate: true,
                                })
                              : ""
                          }
                          disabled={(date) =>
                            date <= new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Tasa de Interés
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? undefined}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Ingrese la tasa de interés anual (opcional).
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loanStatusArray.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs sm:text-sm">
                    El estado actual del préstamo.
                  </FormDescription>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Crear Préstamo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
