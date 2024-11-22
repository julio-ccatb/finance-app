import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { type LoansSelectInput } from "drizzle/schemas/loans";

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

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Información del Préstamo
        </CardTitle>
        <CardDescription>Detalles y estado actual del préstamo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Monto del Préstamo
            </p>
            <p className="text-lg font-semibold">
              ${loan.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <Badge className={`${getStatusColor(loan.status)} text-white`}>
              {getStatusText(loan.status)}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
            <p>{format(new Date(loan.startDate), "PP", { locale: es })}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Fecha de Vencimiento
            </p>
            <p>{format(new Date(loan.dueDate), "PP", { locale: es })}</p>
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
  );
}
