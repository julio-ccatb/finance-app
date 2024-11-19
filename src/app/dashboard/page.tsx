import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Saldo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">€10,000.00</p>
        </CardContent>
      </Card>
      {/* Add more cards for income, expenses, savings goals, etc. */}
    </div>
  );
}
