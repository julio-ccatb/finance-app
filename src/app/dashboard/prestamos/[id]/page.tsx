"use client";

import { ROUTES } from "@/app/_components/utils/routes";

import { ActionButtons } from "@/components/loans/action-buttons";
import { LoanDetailSkeleton } from "@/components/loans/loan-detail-skeleton";
import { LoanInfoCard } from "@/components/loans/loan-info-card";
import { PaymentHistoryTable } from "@/components/loans/payment-history-table";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { api } from "@/trpc/react";
import { type LoansSelectInput } from "drizzle/schemas/loans";
import { type PaymentsSelectInput } from "drizzle/schemas/payments";
import { motion } from "framer-motion";
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

  const handleGeneratePayment = (
    type: "PAYMENT" | "INTREST" | "SURCHARGE",
    amount?: string,
  ) => {
    try {
      setIsGeneratingPayment(true);
      if (type === "INTREST") generatePayment({ loanId, transaction: type });
      // Handle other types of payments here
    } catch (error) {
      console.error("Error generating payment:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGeneratingPayment(false);
    }
  };

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
        {isLoading ? (
          <LoanDetailSkeleton />
        ) : loan ? (
          <>
            <LoanInfoCard loan={loan as LoansSelectInput} />
            <ActionButtons
              onGeneratePayment={handleGeneratePayment}
              isGeneratingPayment={isGeneratingPayment}
            />
            <PaymentHistoryTable
              payments={(loan.payments as PaymentsSelectInput[]) || []}
            />
          </>
        ) : (
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              Préstamo no encontrado
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}