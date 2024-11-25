import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type LoansSelectInput } from "drizzle/schemas/loans";
import { LoanPaymentChart } from "./loan-payment-chart";

interface LoanInfoCardProps {
  loan: LoansSelectInput;
}

export function LoanInfoCard({ loan }: LoanInfoCardProps) {
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

  console.log(loan);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Card className="mt-8 w-full lg:w-1/2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Información del Préstamo
            </CardTitle>
            <Badge className={`${getStatusColor(loan.status)} text-white`}>
              {getStatusText(loan.status)}
            </Badge>
          </div>
          <CardDescription>ID del Préstamo: #{loan.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Monto del Préstamo
                </p>
                <p className="text-xl font-semibold sm:text-2xl">
                  {formatCurrency(parseFloat(loan.amount))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Recargo</p>
                <p className="text-base sm:text-lg">
                  {formatCurrency(parseFloat(loan.surcharge))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Ganancias (Interés)
                </p>
                <p className="text-base sm:text-lg">
                  {formatCurrency(parseFloat(loan.winnings))}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Saldo Restante
                </p>
                <p
                  className={`text-xl font-semibold sm:text-2xl ${
                    parseFloat(loan.amount) - parseFloat(loan.balance) < 100
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {formatCurrency(
                    parseFloat(loan.amount) - parseFloat(loan.balance),
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Tasa de Interés: {loan.interestRate}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha de Inicio
                </p>
                <p>
                  {format(new Date(loan.startDate), "MM/dd/yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha de Vencimiento
                </p>
                <p>
                  {format(new Date(loan.dueDate), "MM/dd/yyyy", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full sm:mt-8 lg:w-1/2">
        <LoanPaymentChart
          winnings={loan.winnings}
          loanAmount={loan.amount}
          balancePaid={loan.balance}
        />
      </div>
    </div>
  );
}
