"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, CreditCard } from "lucide-react";
import { type LoansSelectInput } from "drizzle/schemas/loans";

type BorrowerLoansModalProps = {
  isOpen: boolean;
  onClose: () => void;
  borrower: {
    id: string;
    name: string;
  };
  loans: LoansSelectInput[];
  onGeneratePayment: (loanId: string) => void;
};

export function BorrowerLoansModal({
  isOpen,
  onClose,
  borrower,
  loans,
  onGeneratePayment,
}: BorrowerLoansModalProps) {
  const [isGeneratingPayment, setIsGeneratingPayment] = useState<string | null>(
    null,
  );

  const handleGeneratePayment = async (loanId: string) => {
    setIsGeneratingPayment(loanId);
    onGeneratePayment(loanId);
    setIsGeneratingPayment(null);
  };

  const getStatusColor = (status: LoansSelectInput["status"]) => {
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

  const getStatusText = (status: LoansSelectInput["status"]) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-11/12 max-w-[95vw] overflow-hidden sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Préstamos de {borrower.name}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-2 max-h-[calc(90vh-120px)] px-1 sm:px-2">
          {loans.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-lg text-gray-500">
                No hay préstamos registrados para este prestatario.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <Card
                  key={loan.id}
                  className="flex flex-col overflow-hidden sm:flex-row sm:items-stretch"
                >
                  <div className="flex-grow">
                    <CardHeader className="pb-2 sm:pb-4 sm:pt-4">
                      <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                        <span className="text-sm font-semibold sm:text-base">
                          ${loan.amount.toLocaleString()}
                        </span>
                        <Badge
                          className={`${getStatusColor(loan.status)} px-2 py-1 text-xs text-white`}
                        >
                          {getStatusText(loan.status)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 sm:py-4">
                      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 sm:text-sm">
                        <div>
                          <strong className="block">Inicio:</strong>
                          <span>
                            {format(new Date(loan.startDate), "PP", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        <div>
                          <strong className="block">Vencimiento:</strong>
                          <span>
                            {format(new Date(loan.dueDate), "PP", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        {loan.interestRate !== null && (
                          <div>
                            <strong className="block">Tasa de interés:</strong>
                            <span>{loan.interestRate}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                  <CardFooter className="flex flex-row justify-between gap-2 px-2 pt-2 sm:w-44 sm:flex-col sm:justify-center sm:p-4 sm:px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 px-1 py-1 text-xs sm:h-10 sm:w-full sm:px-2 sm:text-sm"
                      onClick={() => handleGeneratePayment(loan.id)}
                      disabled={
                        isGeneratingPayment === loan.id ||
                        loan.status === "COMPLETED"
                      }
                    >
                      {isGeneratingPayment === loan.id ? (
                        "Generando..."
                      ) : (
                        <>
                          <CreditCard className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Generar Pago</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 px-1 py-1 text-xs sm:h-10 sm:w-full sm:px-2 sm:text-sm"
                      onClick={() => window.open(`/loans/${loan.id}`, "_blank")}
                    >
                      <ExternalLink className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Ver Detalles</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
