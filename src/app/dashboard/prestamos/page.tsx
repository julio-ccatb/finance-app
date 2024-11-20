"use client";
import { BorrowersTable } from "@/components/borrowers/borrowers-table";
import ThemeToggle from "@/components/mode-toggle";
import { PageHeader } from "@/components/page-header";
import { api } from "@/trpc/react";
import { useState } from "react";

const Page = () => {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<string | null>(
    null,
  );

  const { data: borrowers } = api.borrower.list.useQuery();

  const handleViewLoans = (borrowerId: string) => {
    setSelectedBorrowerId(borrowerId);
    // Here you would typically fetch the loans for this borrower
    console.log(`Fetching loans for borrower with ID: ${borrowerId}`);
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
        />

        {selectedBorrowerId && (
          <div className="mt-8">
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
