"use client";

import { ROUTES } from "@/app/_components/utils/routes";
import ThemeToggle from "@/components/mode-toggle";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Plus, DollarSign, Percent, AlertTriangle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.id as string;

  const {
    data: loan,
    isLoading,
    refetch,
  } = api.loans.findById.useQuery(loanId);
  const { mutate: generatePayment } = api.loans.generatePayment.useMutation({
    onSuccess: () => refetch(),
  });

  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newSurchargeAmount, setNewSurchargeAmount] = useState("");

  const handleGeneratePayment = (
    type: "PAYMENT" | "INTREST" | "SURCHARGE",
    amount?: string,
  ) => {
    try {
      if (type === "INTREST") generatePayment({ loanId, transaction: type });
      //   setNewPaymentAmount("");
      //   setNewSurchargeAmount("");
    } catch (error) {
      console.error("Error generating payment:", error);
      // Handle error (e.g., show error message to user)
    }
    setIsGeneratingPayment(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "!bg-green-500";
      case "COMPLETED":
        return "!bg-blue-500";
      case "DEFAULTED":
        return "!bg-red-500";
      default:
        return "!bg-gray-500";
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
    <div className="px-4">
      <PageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Préstamos", href: ROUTES.LOANS },
          { label: `${loanId}`, href: `${ROUTES.LOANS}/${loanId}` },
        ]}
      >
        <ThemeToggle />
      </PageHeader>

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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <DollarSign className="mr-2 h-4 w-4" /> Agregar Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Pago</DialogTitle>
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
                  onClick={() =>
                    handleGeneratePayment("PAYMENT", newPaymentAmount)
                  }
                  disabled={isGeneratingPayment}
                >
                  {isGeneratingPayment ? "Generando..." : "Generar Pago"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Percent className="mr-2 h-4 w-4" /> Generar Interés
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generar Interés</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea generar el interés para este préstamo?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  onClick={() => handleGeneratePayment("INTREST")}
                  disabled={isGeneratingPayment}
                >
                  {isGeneratingPayment ? "Generando..." : "Confirmar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" /> Agregar Recargo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Recargo</DialogTitle>
                <DialogDescription>
                  Ingrese el monto del recargo a aplicar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="surcharge" className="text-right">
                    Monto
                  </Label>
                  <Input
                    id="surcharge"
                    type="number"
                    value={newSurchargeAmount}
                    onChange={(e) => setNewSurchargeAmount(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() =>
                    handleGeneratePayment("SURCHARGE", newSurchargeAmount)
                  }
                  disabled={isGeneratingPayment}
                >
                  {isGeneratingPayment ? "Generando..." : "Aplicar Recargo"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loan.payments?.map((payment) => {
                  if (payment)
                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.paymentDate
                            ? format(new Date(payment.paymentDate), "PP", {
                                locale: es,
                              })
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          ${parseFloat(payment.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payment.status === "COMPLETED"
                                ? "!bg-green-500"
                                : payment.status === "PENDING"
                                  ? "!bg-yellow-500"
                                  : "!bg-red-500"
                            }
                          >
                            {payment.status === "COMPLETED"
                              ? "Completado"
                              : payment.status === "PENDING"
                                ? "Pendiente"
                                : "Expirado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getPaymentTypeText(payment.paymentType)}
                        </TableCell>
                      </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
