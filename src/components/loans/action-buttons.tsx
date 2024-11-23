import { Button } from "@/components/ui/button";
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
import { AlertTriangle, DollarSign, Percent } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onGeneratePayment: (
    type: "PAYMENT" | "INTREST" | "SURCHARGE",
    amount?: string,
  ) => void;
  isGeneratingPayment: boolean;
}

export function ActionButtons({
  onGeneratePayment,
  isGeneratingPayment,
}: ActionButtonsProps) {
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newSurchargeAmount, setNewSurchargeAmount] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [surchargeDialogOpen, setSurchargeDialogOpen] = useState(false);

  const handleGeneratePayment = (
    type: "PAYMENT" | "INTREST" | "SURCHARGE",
    amount?: string,
  ) => {
    onGeneratePayment(type, amount);
    if (type === "PAYMENT") setPaymentDialogOpen(false);
    if (type === "INTREST") setInterestDialogOpen(false);
    if (type === "SURCHARGE") setSurchargeDialogOpen(false);
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
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
              onClick={() => handleGeneratePayment("PAYMENT", newPaymentAmount)}
              disabled={isGeneratingPayment}
            >
              {isGeneratingPayment ? "Generando..." : "Generar Pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
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

      <Dialog open={surchargeDialogOpen} onOpenChange={setSurchargeDialogOpen}>
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
  );
}
