"use client";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BorrowersInsertSchema,
  type BorrowersSelectInput,
} from "drizzle/schemas/borrowers";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { PhoneInput } from "../phone-input/phone-input";

interface CreateBorrowerFormProps {
  label?: string;
  onCreateBorrower?: (
    borrower: Omit<BorrowersSelectInput, "id" | "createdAt">,
  ) => void;
}

export function CreateBorrowerForm({
  label,
  onCreateBorrower,
}: CreateBorrowerFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: createBorrower } = api.borrower.create.useMutation({
    onSuccess: () => {
      toast({
        title: "¡Nuevo prestatario creado exitosamente!",
        description: "el prestatario ha sido registrado correctamente.",
      });
      setIsDialogOpen(false);
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "¡Error al crear el prestatario!",
        description: `Hubo un problema al registrar el prestatario: ${err.message}`,
      });
      setIsDialogOpen(false);
    },
  });

  const form = useForm<z.infer<typeof BorrowersInsertSchema>>({
    resolver: zodResolver(BorrowersInsertSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof BorrowersInsertSchema>) {
    if (onCreateBorrower)
      onCreateBorrower({
        name: values.name,
        email: values.email ?? null,
        phone: values.phone ?? null,
      });
    createBorrower(values);
    // setIsDialogOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="p-4"
          variant={"default"}
          size={label ? "default" : "icon"}
        >
          <Plus className={label && "mr-2 h-4 w-4"} /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Prestatario</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del nuevo prestatario aquí. Haga clic en
            guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="DO"
                      onChange={(value) =>
                        form.setValue("phone", value, { shouldValidate: true })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Prestatario</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
