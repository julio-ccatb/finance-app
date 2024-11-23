import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Decimal from "decimal.js";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface LoanPaymentChartProps {
  loanAmount: string;
  balancePaid: string;
}

export function LoanPaymentChart({
  loanAmount,
  balancePaid,
}: LoanPaymentChartProps) {
  const remainingBalance = parseFloat(
    new Decimal(loanAmount).minus(balancePaid).toString(),
  );
  const paidPercentage = parseFloat(
    new Decimal(balancePaid).div(loanAmount).mul(100).toString(),
  ).toFixed(2);
  const remainingPercentage = parseFloat(
    new Decimal(remainingBalance).div(loanAmount).mul(100).toString(),
  );
  const data = [
    { name: "Pagado", value: parseFloat(paidPercentage) },
    { name: "Restante", value: remainingPercentage },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Desglose de Pago del Préstamo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-between">
          <div className="mb-4 h-[200px] w-full sm:mb-0 sm:h-[180px] sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 text-center sm:w-1/2">
            <div>
              <p className="text-sm font-medium text-gray-500">Pagado</p>
              <p className="text-lg font-semibold">{paidPercentage}%</p>
              <p className="text-sm text-gray-500">
                ${parseFloat(balancePaid).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Restante</p>
              <p className="text-lg font-semibold">
                {remainingPercentage.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500">
                ${remainingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
