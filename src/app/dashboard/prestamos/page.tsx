"use client";
import { BorrowersTable } from "@/components/borrowers/borrowers-table";
import { CreateBorrowerForm } from "@/components/borrowers/create-form";
import { PageHeader } from "@/components/page-header";
import { useState } from "react";

const borrowers = [
  {
    id: 1,
    name: "María García",
    email: "maria@example.com",
    totalLoan: 15000,
    loanCount: 2,
  },
  {
    id: 2,
    name: "Juan Rodríguez",
    email: "juan@example.com",
    totalLoan: 25000,
    loanCount: 3,
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana@example.com",
    totalLoan: 10000,
    loanCount: 1,
  },
  {
    id: 4,
    name: "Carlos López",
    email: "carlos@example.com",
    totalLoan: 30000,
    loanCount: 4,
  },
  {
    id: 5,
    name: "Laura Sánchez",
    email: "laura@example.com",
    totalLoan: 20000,
    loanCount: 2,
  },
  // Add more borrowers as needed
];

const Page = () => {
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(
    null,
  );

  const handleViewLoans = (borrowerId: number) => {
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
      ></PageHeader>

      <main className="sm:flex-grow">
        <BorrowersTable borrowers={borrowers} onViewLoans={handleViewLoans} />

        {selectedBorrowerId && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">
              Préstamos de{" "}
              {borrowers.find((b) => b.id === selectedBorrowerId)?.name}
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
