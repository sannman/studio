
import BillPayment from "@/components/BillPayment";
import ReportingDashboard from "@/components/ReportingDashboard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">TipSplit</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BillPayment />
        <ReportingDashboard />
      </div>
    </main>
  );
}

