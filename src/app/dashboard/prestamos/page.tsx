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
import { CreditCard, DollarSign, PiggyBank, TrendingUp } from "lucide-react";
import Loading from "./loading";
import { LoanPaymentChart } from "@/components/loans/loan-payment-chart";

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
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Prestado
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalPrestado)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendiente
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalPendiente)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancias</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalGanancias)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Porcentaje de Ganancia
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {porcentajeGanancia.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
        <div className="w-1/3">
          <LoanPaymentChart
            winnings={totalGanancias.toString()}
            loanAmount={totalPrestado.toString()}
            balancePaid={totalDevuelto.toString()}
          />
        </div>

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
