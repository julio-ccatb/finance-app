import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
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

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Historial de Pagos</CardTitle>
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
            {payments.map((payment) => (
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
                <TableCell>{getPaymentTypeText(payment.paymentType)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
