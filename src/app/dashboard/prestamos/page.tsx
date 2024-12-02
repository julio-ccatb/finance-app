"use client";

import { BorrowersTable } from "@/components/borrowers/borrowers-table";
import { CreateLoanModal } from "@/components/loans/create-form";
import { BorrowerLoansModal } from "@/components/loans/list-modal";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  CreditCard,
  DollarSign,
  Eye,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import Loading from "./loading";
import { LoanPaymentChart } from "@/components/loans/loan-payment-chart";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoansModalOpen, setIsLoansModalOpen] = useState(false);

  const { data: borrowers, refetch } = api.borrower.list.useQuery();
  const { mutate: createLoan } = api.loans.create.useMutation();

  useEffect(() => void refetch(), [isOpen, isLoansModalOpen, refetch]);

  if (!borrowers) return <Loading />;

  const totalPrestado = borrowers.reduce(
    (sum, borrower) =>
      sum +
      borrower.loans.reduce(
        (loanSum, loan) =>
          loan.status === "ACTIVE"
            ? loanSum + parseFloat(loan.amount)
            : loanSum,
        0,
      ),
    0,
  );

  const totalDevuelto = borrowers.reduce(
    (sum, borrower) =>
      sum +
      borrower.loans.reduce(
        (loanSum, loan) =>
          loan.status === "ACTIVE"
            ? loanSum + parseFloat(loan.balance)
            : loanSum,
        0,
      ),
    0,
  );
  const totalGanancias = borrowers.reduce(
    (sum, borrower) =>
      sum +
      borrower.loans.reduce(
        (loanSum, loan) =>
          loan.status === "ACTIVE"
            ? loanSum + parseFloat(loan.winnings)
            : loanSum,
        0,
      ),
    0,
  );

  const totalPendiente = totalPrestado - totalDevuelto;
  const porcentajeGanancia =
    totalPrestado > 0 ? (totalGanancias / totalPrestado) * 100 : 0;

  const summaryCards = [
    { title: "Total Prestado", value: totalPrestado, icon: CreditCard },
    { title: "Total Pendiente", value: totalPendiente, icon: DollarSign },
    { title: "Ganancias", value: totalGanancias, icon: PiggyBank },
    {
      title: "Porcentaje de Ganancia",
      value: `${porcentajeGanancia.toFixed(2)} %`,
      icon: TrendingUp,
      raw: true,
    },
  ];

  const handleViewLoans = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setIsLoansModalOpen(true);
    console.log(`Fetching loans for borrower with ID: ${borrowerId}`);
  };

  const handleCreateLoan = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setIsOpen(true);
  };

  const handleGeneratePayment = async (loanId: string) => {
    console.log(`Generating payment for loan: ${loanId}`);
  };

  return (
    <div className="space-y-6 px-4">
      <PageHeader
        breadcrumbs={[
          { label: "Panel", href: "/dashboard" },
          { label: "Préstamos", href: "/dashboard/prestamos" },
        ]}
      >
        <ThemeToggle />
      </PageHeader>

      <main className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    Resumen Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {summaryCards.map(({ title, value, icon: Icon, raw }) => (
                      <div
                        key={title}
                        className="flex justify-between sm:flex-col"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{title}: </span>
                        </div>
                        <span className="font-mono text-muted-foreground">
                          {raw ? value : formatCurrency(value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <div className="flex flex-col space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Calculator className="mr-2 h-4 w-4" />
                Generar Interés Mensuales
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Ver Pagos Pendientes
              </Button>
            </div>
          </div>
          <div className="rounded-lg lg:col-span-2">
            <LoanPaymentChart
              size="small"
              winnings={totalGanancias.toString()}
              loanAmount={totalPrestado.toString()}
              balancePaid={totalDevuelto.toString()}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Prestatarios</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <BorrowersTable
              borrowers={borrowers ?? []}
              onViewLoans={handleViewLoans}
              onCreateLoan={handleCreateLoan}
              onMoreActions={() => null}
            />
          </CardContent>
        </Card>

        {selectedBorrowerId && borrowers && (
          <>
            <CreateLoanModal
              onClose={() => setIsOpen(false)}
              isOpen={isOpen}
              borrowerId={selectedBorrowerId}
              onCreateLoan={(data) => createLoan(data)}
            />
            <BorrowerLoansModal
              isOpen={isLoansModalOpen}
              onClose={() => setIsLoansModalOpen(false)}
              borrower={
                borrowers.find(
                  (borrower) => borrower.id === selectedBorrowerId,
                )!
              }
              loans={
                borrowers.find(
                  (borrower) => borrower.id === selectedBorrowerId,
                )!.loans
              }
              onGeneratePayment={handleGeneratePayment}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Page;
