
import { Header } from '@/components/Header';
import { ReportGenerator } from '@/components/ReportGenerator';

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="Reports"
        description="Generate and download reports for your permit packages."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <ReportGenerator />
      </main>
    </div>
  );
}
