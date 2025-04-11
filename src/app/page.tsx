"use client";

import BillPayment from "@/components/BillPayment";
import ReportingDashboard from "@/components/ReportingDashboard";
import WaiterSetup from "@/components/WaiterSetup"; // Import WaiterSetup
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaiterProvider } from "@/context/WaiterContext";

export default function Home() {
  return (
    <WaiterProvider>
      <main className="flex min-h-screen flex-col items-center justify-start p-24">
        <h1 className="text-4xl font-bold mb-8">TipSplit</h1>
        <Tabs defaultValue="billPayment" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="billPayment">Bill Payment</TabsTrigger>
            <TabsTrigger value="waiterSetup">Waiter Setup</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>
          <TabsContent value="billPayment">
            <BillPayment />
          </TabsContent>
          <TabsContent value="waiterSetup">
            <WaiterSetup /> {/* Render WaiterSetup */}
          </TabsContent>
          <TabsContent value="reporting">
            <ReportingDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </WaiterProvider>
  );
}

