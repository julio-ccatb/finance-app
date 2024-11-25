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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";

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

  const chartData = [
    {
      name: "Pagado",
      value: parseFloat(paidPercentage),
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Restante",
      value: remainingPercentage,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Ganancias",
      value: remainingPercentage,
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
              content={<ChartTooltipContent>L</ChartTooltipContent>}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
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
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-4">
        <div className="grid w-full grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pagado</p>
            <p className="text-lg font-semibold">{paidPercentage}%</p>
            <p className="text-sm text-muted-foreground">
              ${parseFloat(balancePaid).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Restante
            </p>
            <p className="text-lg font-semibold">
              {remainingPercentage.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground">
              ${remainingBalance.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          <span>Progreso del pago del préstamo</span>
        </div>
      </CardFooter>
    </Card>
  );
}
