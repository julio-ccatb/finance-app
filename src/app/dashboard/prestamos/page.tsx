"use client";
import { BorrowersTable } from "@/components/borrowers/borrowers-table";
import { CreateLoanModal } from "@/components/loans/create-form";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { api } from "@/trpc/react";
import { useState } from "react";

const Page = () => {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const { data: borrowers } = api.borrower.list.useQuery();
  const { mutate: createLoan, data: createdLoan } =
    api.loans.create.useMutation();

  const handleViewLoans = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    // Here you would typically fetch the loans for this borrower
    console.log(`Fetching loans for borrower with ID: ${borrowerId}`);
  };
  const handleCreateLoan = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    setIsOpen(true);
    // Here you would typically fetch the loans for this borrower
    // createLoan(borrowerId);
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

        {selectedBorrowerId && (
          <div className="mt-8">
            <CreateLoanModal
              onClose={() => setIsOpen(false)}
              isOpen={isOpen}
              borrowerId={selectedBorrowerId}
              onCreateLoan={(data) => createLoan(data)}
            />
            <h2 className="mb-4 text-xl font-semibold">
              Préstamos de{" "}
              {borrowers?.find((b) => b.id === selectedBorrowerId)?.name}
            </h2>
            {/* Here you would render the loans for the selected borrower */}
            <p className="text-gray-600">
              Tabla de préstamos se implementará aquí usando TanStack Table.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
