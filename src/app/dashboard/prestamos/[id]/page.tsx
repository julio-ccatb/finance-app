"use client";

import { ROUTES } from "@/app/_components/utils/routes";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.id as string;

  const { data: loan, isLoading } = api.loans.findById.useQuery(loanId);

  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");

  const handleGeneratePayment = async () => {
    setIsGeneratingPayment(true);
    try {
      // Simulating API call to generate payment
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      //   const newPayment = {
      //     id: `${payments.length + 1}`,
      //     amount: parseFloat(newPaymentAmount),
      //     date: new Date().toISOString().split("T")[0],
      //     status: "COMPLETED",
      //   } as PaymentsSelectInput;
      //   setPayments([...payments, newPayment]);
      setNewPaymentAmount("");
      // In a real app, you'd update the loan status if necessary
    } catch (error) {
      console.error("Error generating payment:", error);
      // Handle error (e.g., show error message to user)
    }
    setIsGeneratingPayment(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-blue-500";
      case "DEFAULTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activo";
      case "COMPLETED":
        return "Pagado";
      case "DEFAULTED":
        return "En mora";
      default:
        return "Desconocido";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex h-screen items-center justify-center">
        Préstamo no encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Préstamos", href: ROUTES.LOANS },
          { label: `${loanId}`, href: `${ROUTES.LOANS}/${loanId}` },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Información del Préstamo
            </CardTitle>
            <CardDescription>
              Detalles y estado actual del préstamo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Monto del Préstamo
                </p>
                <p className="text-lg font-semibold">
                  ${loan.amount?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <Badge
                  className={`${getStatusColor(loan.status ?? "")} text-white`}
                >
                  {getStatusText(loan.status ?? "")}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha de Inicio
                </p>
                <p>
                  {format(new Date(loan.startDate ?? ""), "PP", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha de Vencimiento
                </p>
                <p>
                  {format(new Date(loan.dueDate ?? ""), "PP", { locale: es })}
                </p>
              </div>
              {loan.interestRate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tasa de Interés
                  </p>
                  <p>{loan.interestRate}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Historial de Pagos
            </CardTitle>
            <CardDescription>
              Registro de todos los pagos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.date), "PP", { locale: es })}
                    </TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          payment.status === "COMPLETED"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      >
                        {payment.status === "COMPLETED"
                          ? "Completado"
                          : "Pendiente"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Generar Nuevo Pago
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Generar Nuevo Pago</DialogTitle>
                  <DialogDescription>
                    Ingrese el monto del pago a realizar.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Monto
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleGeneratePayment}
                    disabled={isGeneratingPayment}
                  >
                    {isGeneratingPayment ? "Generando..." : "Generar Pago"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
