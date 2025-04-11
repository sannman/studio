"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

interface TipData {
  waiterId: string;
  totalTips: number;
}

const ReportingDashboard = () => {
  const [totalBills, setTotalBills] = useState(50); // Placeholder
  const [totalTips, setTotalTips] = useState(500); // Placeholder
  const [tipBreakdown, setTipBreakdown] = useState<TipData[]>([
    { waiterId: '1', totalTips: 150 },
    { waiterId: '2', totalTips: 200 },
    { waiterId: '3', totalTips: 150 },
  ]);

  useEffect(() => {
    // Simulate fetching data from a temporary data store or service.
    // Replace with actual data fetching logic.
    const fetchData = async () => {
      // In a real app, this would fetch data from an API or database.
      // For now, we'll use placeholder data.
    };

    fetchData();
  }, []);

  return (
    <Card className="w-auto">
      <CardHeader>
        <CardTitle>Reporting Dashboard</CardTitle>
        <CardDescription>Overview of restaurant financials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Total Bills</h3>
            <p>{totalBills}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Tips Collected</h3>
            <p>₹{totalTips.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Tip Breakdown per Waiter</h3>
          <Table>
            <TableCaption>A summary of tips collected per waiter.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Waiter ID</TableHead>
                <TableHead>Total Tips</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipBreakdown.map((tip, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{tip.waiterId}</TableCell>
                  <TableCell>₹{tip.totalTips.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
           </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingDashboard;

    