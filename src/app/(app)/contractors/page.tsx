
import { Header } from '@/components/Header';
import { ContractorManager } from '@/components/ContractorManager';

export default function ContractorsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="Contractors"
        description="Manage your list of contractors."
      />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <ContractorManager />
      </main>
    </div>
  );
}
