/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoanDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 rounded-md bg-gray-200 dark:bg-gray-700" />

      <Card>
        <CardHeader>
          <div className="h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-md bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="mt-2 h-4 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-6 rounded-md bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
