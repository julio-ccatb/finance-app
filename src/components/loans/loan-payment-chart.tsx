"use client";

import React from "react";
import Decimal from "decimal.js";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";

interface LoanPaymentChartProps {
  loanAmount: string;
  balancePaid: string;
  winnings: string;
}

export function LoanPaymentChart({
  loanAmount,
  balancePaid,
  winnings,
}: LoanPaymentChartProps) {
  const remainingBalance = parseFloat(
    new Decimal(loanAmount).minus(balancePaid).toString(),
  );
  const paidPercentage = parseFloat(
    new Decimal(balancePaid).div(loanAmount).mul(100).toFixed(2).toString(),
  );
  const remainingPercentage = parseFloat(
    new Decimal(remainingBalance).div(loanAmount).mul(100).toString(),
  );
  const winningsPorcentage = parseFloat(
    new Decimal(winnings).div(loanAmount).mul(100).toString(),
  );

  const chartData = [
    {
      namelabel: "Pagado",
      value: paidPercentage,
      fill: "hsl(var(--chart-2))",
    },
    {
      namelabel: "Restante",
      value: remainingPercentage,
      fill: "hsl(var(--chart-1))",
    },
    {
      namelabel: "Ganancias",
      value: winningsPorcentage,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    pagado: {
      label: "Pagado",
      color: "hsl(var(--chart-1))",
    },
    restante: {
      label: "Restante",
      color: "hsl(var(--chart-2))",
    },
    ganancias: {
      label: "Ganancias",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Desglose de Pago del Préstamo</CardTitle>
        <CardDescription>Estado Actual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent sufix="%" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="namelabel"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              activeIndex={2}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="grid w-full grid-cols-3 gap-4 text-center">
          {[
            {
              label: "Pagado",
              percentage: paidPercentage,
              amount: balancePaid,
            },
            {
              label: "Ganancias",
              percentage: winningsPorcentage,
              amount: winnings,
            },
            {
              label: "Restante",
              percentage: remainingPercentage,
              amount: remainingBalance,
            },
          ].map(({ label, percentage, amount }) => (
            <div key={label} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <p className="text-lg font-semibold">{percentage.toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground">
                ${amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>Progreso del pago del préstamo</span>
        </div>
      </CardFooter>
    </Card>
  );
}
