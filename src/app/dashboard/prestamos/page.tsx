"use client";
import { BorrowersTable } from "@/components/borrowers/borrowers-table";
import { CreateLoanModal } from "@/components/loans/create-form";
import { BorrowerLoansModal } from "@/components/loans/list-modal";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

const Page = () => {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoansModalOpen, setIsLoansModalOpen] = useState(false);

  const { data: borrowers, refetch } = api.borrower.list.useQuery();
  const { mutate: createLoan, data: createdLoan } =
    api.loans.create.useMutation();

  useEffect(() => void refetch(), [isOpen, isLoansModalOpen, refetch]);

  const handleViewLoans = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setIsLoansModalOpen(true);
    // Here you would typically fetch the loans for this borrower
    console.log(`Fetching loans for borrower with ID: ${borrowerId}`);
  };
  const handleCreateLoan = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setIsOpen(true);
    // Here you would typically fetch the loans for this borrower
    // createLoan(borrowerId);
  };
  const handleGeneratePayment = async (loanId: string) => {
    // Implement the logic to generate a payment for the given loan
    console.log(`Generating payment for loan: ${loanId}`);
    // You might want to update the loan status or refresh the loans list after this
  };

  return (
    <div className="px-2">
      <PageHeader
        breadcrumbs={[
          { label: "panel", href: "/dashboard" },
          { label: "Prestamos", href: "/dashboard/prestamos" },
        ]}
      >
        <ThemeToggle />
      </PageHeader>

      <main className="sm:flex-grow">
        <BorrowersTable
          borrowers={borrowers ?? []}
          onViewLoans={handleViewLoans}
          onCreateLoan={handleCreateLoan}
          onMoreActions={() => null}
        />

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
